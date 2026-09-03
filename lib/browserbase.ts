import { browserbase, type StagehandBrowser } from "@browserbasehq/stagehand";

export type { StagehandBrowser };

export async function launchResearchBrowser(): Promise<StagehandBrowser> {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  if (!apiKey) {
    throw new Error("BROWSERBASE_API_KEY environment variable is not set");
  }
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("BROWSERBASE_PROJECT_ID environment variable is not set");
  }
  return browserbase.launch({ apiKey, projectId });
}
