import { getClient, parseLenientJson, OPENROUTER_MODEL_GENERATE } from "./openrouter";

export const RESUME_GENERATION_PROMPT = `You are a professional resume writer. Given a candidate's profile data, produce clean, professional resume content formatted as structured JSON.

Return ONLY a JSON object with exactly these keys:
- "summary": string (1-2 sentences, professional tone)
- "experience": array of strings (each string = 2-4 polished bullet points for one role, using action verbs and concrete outcomes; combine multiple roles into separate array entries)
- "education": string (one concise line: degree, field, institution, year)
- "skills_highlight": array of strings (5-8 top skills from profile, as short labels)

Rules:
- Write in clean professional English. No fluff. No first-person pronouns.
- Keep the entire output concise — it must fit a single-page A4 resume.
- If the profile has many roles, condense to the most relevant 2-3 roles and summarize the rest briefly.
- Do not invent companies, skills, or dates. Only use data provided.
- Return ONLY the JSON object. No markdown, no explanations.`;

export type ResumeContent = {
  summary: string;
  experience: string[];
  education: string;
  skills_highlight: string[];
};

export async function generateResumeContent(profileData: Record<string, unknown>): Promise<{ success: boolean; data?: ResumeContent; error?: string }> {
  try {
    const client = getClient();
    const userPrompt = `Candidate profile:\n${JSON.stringify(profileData, null, 2)}\n\nGenerate professional resume content as structured JSON matching the schema described.`;

    const response = await client.chat.completions.create({
      model: OPENROUTER_MODEL_GENERATE,
      messages: [
        { role: "system", content: RESUME_GENERATION_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: "No content returned from resume generation model" };
    }

    const parsed = parseLenientJson(content);
    if (!parsed) {
      return { success: false, error: "Failed to parse resume generation response as JSON" };
    }

    const data: ResumeContent = {
      summary: String(parsed.summary ?? ""),
      experience: Array.isArray(parsed.experience) ? parsed.experience.map(String) : [],
      education: String(parsed.education ?? ""),
      skills_highlight: Array.isArray(parsed.skills_highlight) ? parsed.skills_highlight.map(String) : [],
    };

    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[resume-generation] generation failed:", message);
    return { success: false, error: message };
  }
}
