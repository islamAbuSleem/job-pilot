import OpenAI from "openai";

export const OPENROUTER_MODEL = "inclusionai/ling-3.0-flash-fin:free";
export const OPENROUTER_VISION_MODEL = "google/gemma-4-31b-it:free";
export const OPENROUTER_FALLBACK_MODEL = "openrouter/free";
export const OPENROUTER_SECONDARY_TEXT_MODEL = "nvidia/nemotron-3.5-lightning:free";
export const OPENROUTER_MODEL_GENERATE = "minimax/minimax-m3:free";
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

let cachedClient: OpenAI | null = null;

export function getClient(): OpenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }
  cachedClient = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "JobPilot",
    },
  });
  return cachedClient;
}

const SYSTEM_PROMPT = `You are an expert resume parser. Extract structured profile information from the resume text below. Return ONLY valid JSON matching the exact schema provided. Do not include any explanations, markdown, or extra text.

JSON Schema:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "work_authorization": "citizen | permanent_resident | visa_required",
  "current_title": "string",
  "experience_level": "junior | mid | senior | lead",
  "years_experience": "number",
  "skills": "string[]",
  "industries": "string[]",
  "work_experience": [
    {
      "company": "string",
      "job_title": "string",
      "start_date": "YYYY-MM",
      "end_date": "string (empty if current)",
      "current": "boolean",
      "key_responsibilities": "string"
    }
  ],
  "education": {
    "highest_degree": "high_school | associate | bachelor | master | doctorate",
    "field_of_study": "string",
    "institution_name": "string",
    "graduation_year": "string"
  },
  "job_titles_seeking": "string[]",
  "remote_preference": "remote | onsite | hybrid | any",
  "salary_expectation": "string",
  "preferred_locations": "string[]",
  "cover_letter_tone": "formal | casual | enthusiastic"
}

Rules:
- Extract only information explicitly present in the resume
- For missing optional fields, use empty string or empty array
- For required fields, make reasonable inferences from context
- Dates in YYYY-MM format (e.g., "2022-01")
- If currently working at a company, end_date should be empty string and current=true
- years_experience: calculate total years from work history
- skills/industries/job_titles_seeking/preferred_locations as arrays of strings
- If information is not in resume, use empty string/array`;

type ChatContent =
  | string
  | Array<{ type: "text" | "image_url"; text?: string; image_url?: { url: string } }>;

type ExtractionParams = {
  primaryModel: string;
  userContent: ChatContent;
  vision?: boolean;
};

export type ExtractionResult = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  rateLimited?: boolean;
};

function isModelNotFound(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("404") ||
    msg.toLowerCase().includes("not available") ||
    msg.toLowerCase().includes("no endpoints")
  );
}

function isRateLimited(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("quota");
}

/**
 * Some free-tier models wrap JSON in ```json ... ``` fences or prefix it with
 * prose despite response_format: json_object. Try a direct parse, then strip
 * fences, then locate the first balanced {...} span.
 */
export function parseLenientJson(content: string): Record<string, unknown> | null {
  const trimmed = content.trim();

  try {
    const v = JSON.parse(trimmed);
    if (v && typeof v === "object") return v as Record<string, unknown>;
  } catch {
    /* fall through */
  }

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) {
    try {
      const v = JSON.parse(fence[1]);
      if (v && typeof v === "object") return v as Record<string, unknown>;
    } catch {
      /* fall through */
    }
  }

  const start = trimmed.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = start; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const candidate = trimmed.slice(start, i + 1);
          try {
            const v = JSON.parse(candidate);
            if (v && typeof v === "object") return v as Record<string, unknown>;
          } catch {
            /* fall through */
          }
          break;
        }
      }
    }
  }

  return null;
}

async function callOneModel(
  client: OpenAI,
  model: string,
  userContent: ChatContent,
): Promise<ExtractionResult> {
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent as never },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: `No content returned from ${model}` };
    }

    const parsed = parseLenientJson(content);
    if (!parsed) {
      return {
        success: false,
        error: `Failed to parse ${model} response as JSON`,
      };
    }

    return { success: true, data: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[openrouter] ${model} failed:`, message);
    return {
      success: false,
      error: message,
      rateLimited: isRateLimited(error) || isModelNotFound(error),
    };
  }
}

async function callExtractionWithFallback({
  primaryModel,
  userContent,
  vision = false,
}: ExtractionParams): Promise<ExtractionResult> {
  const client = getClient();
  const chain = vision
    ? [primaryModel, OPENROUTER_FALLBACK_MODEL]
    : [primaryModel, OPENROUTER_FALLBACK_MODEL, OPENROUTER_SECONDARY_TEXT_MODEL];
  const models = chain.filter((m, i, a) => Boolean(m) && a.indexOf(m) === i) as string[];

  let lastError: string | undefined;
  let anyRateLimited = false;

  for (const model of models) {
    const result = await callOneModel(client, model, userContent);
    if (result.success) {
      return result;
    }
    lastError = result.error;
    if (result.rateLimited) anyRateLimited = true;
    // Stop early on non-availability errors (auth, malformed payload) — those
    // won't be fixed by trying another model.
    if (
      result.error &&
      !result.rateLimited &&
      !result.error.startsWith("Failed to parse")
    ) {
      return result;
    }
  }

  return {
    success: false,
    error: lastError ?? "Extraction failed",
    rateLimited: anyRateLimited,
  };
}

export async function extractProfileFromResume(resumeText: string): Promise<ExtractionResult> {
  const userPrompt = `Resume text:\n\n${resumeText}\n\nReturn only the JSON object.`;
  return callExtractionWithFallback({ primaryModel: OPENROUTER_MODEL, userContent: userPrompt });
}

export async function extractProfileFromResumeWithRetry(
  resumeText: string,
  maxRetries = 2
): Promise<ExtractionResult> {
  let lastError: string | undefined;
  let lastRateLimited = false;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await extractProfileFromResume(resumeText);
    if (result.success) {
      return result;
    }
    lastError = result.error;
    if (result.rateLimited) lastRateLimited = true;
    if (attempt < maxRetries) {
      console.log(`[openrouter] Extraction attempt ${attempt + 1} failed: ${result.error}. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return {
    success: false,
    error: lastError ?? "Failed after retries",
    rateLimited: lastRateLimited,
  };
}

export type VisionPage = { pageNumber: number; base64: string };

export async function extractProfileFromResumeVision(pages: VisionPage[]): Promise<ExtractionResult> {
  if (pages.length === 0) {
    return { success: false, error: "No pages to extract" };
  }

  const imageContent: ChatContent = [
    { type: "text", text: "Resume pages (read all visible text carefully, including headers, footers, and sidebars):" },
    ...pages.map((p) => ({
      type: "image_url" as const,
      image_url: { url: `data:image/png;base64,${p.base64}` },
    })),
    { type: "text", text: "Return only the JSON object matching the schema." },
  ];

  return callExtractionWithFallback({
    primaryModel: OPENROUTER_VISION_MODEL,
    userContent: imageContent,
    vision: true,
  });
}