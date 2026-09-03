import { Stagehand, type StagehandBrowser } from "@browserbasehq/stagehand";

const STAGEHAND_MODEL = "groq/llama-3.3-70b-versatile";

export async function createStagehand(
  browser: StagehandBrowser,
): Promise<Stagehand> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  return Stagehand.create({
    browser,
    model: { modelName: STAGEHAND_MODEL, apiKey },
  });
}
