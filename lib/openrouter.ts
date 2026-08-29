import OpenAI from "openai";

export const OPENROUTER_MODEL = "qwen/qwen-2.5-72b-instruct:free";
export const OPENROUTER_VISION_MODEL = "google/gemma-4-31b-it:free";
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
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

export async function extractProfileFromResume(
  resumeText: string
): Promise<{
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}> {
  const userPrompt = `Resume text:\n\n${resumeText}\n\nReturn only the JSON object.`;

  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: "No content returned from model" };
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { success: false, error: "Failed to parse model response as JSON" };
    }

    return { success: true, data: parsed };
  } catch (error) {
    console.error("[openrouter] extraction failed:", error);
    return { success: false, error: "Failed to extract profile from resume" };
  }
}

export async function extractProfileFromResumeWithRetry(
  resumeText: string,
  maxRetries = 2
): Promise<{
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}> {
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await extractProfileFromResume(resumeText);
    if (result.success) {
      return result;
    }
    lastError = result.error;
    if (attempt < maxRetries) {
      console.log(`[openrouter] Extraction attempt ${attempt + 1} failed: ${result.error}. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return { success: false, error: lastError ?? "Failed after retries" };
}

export type VisionPage = { pageNumber: number; base64: string };

export async function extractProfileFromResumeVision(
  pages: VisionPage[],
  maxRetries = 2
): Promise<{
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}> {
  if (pages.length === 0) {
    return { success: false, error: "No pages to extract" };
  }

  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const client = getClient();
      const imageContent = pages.map((p) => ({
        type: "image_url" as const,
        image_url: { url: `data:image/png;base64,${p.base64}` },
      }));

      const userContent = [
        { type: "text" as const, text: "Resume pages (read all visible text carefully, including headers, footers, and sidebars):" },
        ...imageContent,
        { type: "text" as const, text: "Return only the JSON object matching the schema." },
      ];

      const response = await client.chat.completions.create({
        model: OPENROUTER_VISION_MODEL,
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
        lastError = "No content returned from vision model";
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return { success: false, error: lastError };
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(content);
      } catch {
        lastError = "Failed to parse vision model response as JSON";
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return { success: false, error: lastError };
      }

      return { success: true, data: parsed };
    } catch (error) {
      console.error(`[openrouter] vision extraction attempt ${attempt + 1} failed:`, error);
      lastError = error instanceof Error ? error.message : "Vision extraction failed";
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  return { success: false, error: lastError ?? "Failed after retries" };
}