import { z } from "zod";
import { launchResearchBrowser } from "@/lib/browserbase";
import { createStagehand } from "@/lib/stagehand";
import type { StagehandBrowser } from "@/lib/browserbase";
import { deriveCompanyHomepageUrl } from "@/lib/company-url";
import {
  getClient,
  parseLenientJson,
  OPENROUTER_MODEL,
  OPENROUTER_FALLBACK_MODEL,
  OPENROUTER_SECONDARY_TEXT_MODEL,
} from "@/lib/openrouter";
import type { JobResearchDossier } from "@/lib/job-details";
import type { ProfileForMatching } from "./types";

export type ResearchJob = {
  title: string;
  company: string;
  description: string;
  sourceUrl: string;
  matchedSkills: string[];
  missingSkills: string[];
};

const homepageSchema = z.object({
  oneLiner: z.string().describe("What the company does in one sentence"),
  productSummary: z
    .string()
    .describe("What they build/sell and who it's for"),
  signals: z
    .array(z.string())
    .describe("Funding, notable customers, scale, mission, recent news"),
  pageLinks: z
    .array(
      z.object({
        url: z.string(),
        kind: z.enum([
          "about",
          "careers",
          "blog",
          "engineering",
          "product",
          "team",
          "other",
        ]),
      }),
    )
    .describe("Internal links worth visiting"),
});

const subPageSchema = z.object({
  keyPoints: z.array(z.string()),
  technologies: z
    .array(z.string())
    .describe("Specific languages, frameworks, tools, platforms"),
  valuesOrCulture: z
    .array(z.string())
    .describe("Stated values, working style, team norms"),
  notable: z
    .array(z.string())
    .describe("Customers, funding, scale, projects, awards"),
});

type HomepageData = z.infer<typeof homepageSchema>;
type SubPageData = z.infer<typeof subPageSchema>;

const HOMEPAGE_INSTRUCTION =
  "This is a company's homepage. Capture what the company actually does, who it's for, and any concrete signals (funding, customers, scale, mission, recent launches). Then find the internal links most worth visiting to research them as an employer.";

const SUBPAGE_INSTRUCTION =
  "Extract substance that helps a candidate understand this company before applying: what they do, their values and how they work, the specific technologies and tools they use, notable projects or customers, and how the team operates. Ignore nav, footers, cookie banners, and generic marketing copy.";

const KIND_PRIORITY: Record<string, number> = {
  about: 0,
  blog: 1,
  engineering: 2,
  product: 3,
  careers: 4,
  team: 5,
  other: 6,
};

const MAX_SUBPAGES = 3;

function isRetryableModelError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("404") ||
    m.includes("429") ||
    m.includes("rate limit") ||
    m.includes("quota") ||
    m.includes("no endpoints") ||
    m.includes("not available")
  );
}

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function emptyDossier(): JobResearchDossier {
  return {
    companyOverview: "",
    techStack: [],
    culture: [],
    whyThisRole: "",
    yourEdge: [],
    gapsToAddress: [],
    smartQuestions: [],
    interviewPrep: [],
    sources: [],
  };
}

function pickSubPages(links: HomepageData["pageLinks"]): string[] {
  const seen = new Set<string>();
  const ranked = [...(links ?? [])]
    .filter((l) => typeof l?.url === "string" && l.url.startsWith("http"))
    .filter((l) => {
      if (seen.has(l.url)) return false;
      seen.add(l.url);
      return true;
    })
    .sort(
      (a, b) =>
        (KIND_PRIORITY[a.kind] ?? 6) - (KIND_PRIORITY[b.kind] ?? 6),
    );
  return ranked.slice(0, MAX_SUBPAGES).map((l) => l.url);
}

/**
 * Resolve the real employer URL by navigating to the Adzuna source_url in
 * the real browser. The browser follows the Adzuna 302 redirect naturally
 * and (unlike Node fetch, which CloudFront 403s) lands on the actual
 * employer job page. We then strip subdomains to derive the company
 * homepage.
 *
 * Falls back to a name-based guess if the navigation throws or lands back
 * on adzuna.com.
 */
async function resolveEmployerUrl(
  page: Awaited<ReturnType<StagehandBrowser["context"]["pages"]>>[number],
  company: string,
  sourceUrl: string | null,
): Promise<string> {
  if (sourceUrl) {
    try {
      await page.goto(sourceUrl, { waitUntil: "domcontentloaded" });
      const finalUrl = await page.url();
      if (finalUrl && !finalUrl.includes("adzuna.com")) {
        const hostname = new URL(finalUrl).hostname.replace(/^www\./, "");
        const parts = hostname.split(".");
        const rootDomain = parts.length >= 2 ? parts.slice(-2).join(".") : hostname;
        if (rootDomain && rootDomain !== hostname) {
          return `https://${rootDomain}`;
        }
        if (rootDomain) {
          return `https://${rootDomain}`;
        }
      }
    } catch {
      /* fall through to name-based fallback */
    }
  }
  return deriveCompanyHomepageUrl(company);
}

const SYNTHESIS_SYSTEM = `You are a sharp career strategist preparing a candidate to apply for a specific role. You are given (a) research collected from the company's own website, (b) the job posting, and (c) the candidate's profile. Produce a concise, concrete briefing that gives this specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": string,
  "techStack": string[],
  "culture": string[],
  "whyThisRole": string,
  "yourEdge": string[],
  "gapsToAddress": string[],
  "smartQuestions": string[],
  "interviewPrep": string[],
  "sources": string[]
}`;

function buildSynthesisPrompt(
  job: ResearchJob,
  profile: ProfileForMatching,
  companyResearch: unknown,
): string {
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  return `COMPANY RESEARCH (from their website):
${JSON.stringify(companyResearch)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Matched skills (already computed): ${(job.matchedSkills ?? []).join(", ")}
Missing skills (already computed): ${(job.missingSkills ?? []).join(", ")}

CANDIDATE PROFILE:
Current title: ${profile.current_title ?? "(none)"}
Experience: ${profile.years_experience ?? "(unknown)"} years, level ${profile.experience_level ?? "(none)"}
Skills: ${skills.length ? skills.join(", ") : "(none)"}
Work history: ${JSON.stringify(profile.work_experience ?? [])}`;
}

async function synthesize(
  job: ResearchJob,
  profile: ProfileForMatching,
  companyResearch: unknown,
): Promise<JobResearchDossier> {
  const chain = [
    OPENROUTER_MODEL,
    OPENROUTER_FALLBACK_MODEL,
    OPENROUTER_SECONDARY_TEXT_MODEL,
  ].filter((m, i, a) => Boolean(m) && a.indexOf(m) === i) as string[];

  const userPrompt = buildSynthesisPrompt(job, profile, companyResearch);
  let lastError = "";
  for (const model of chain) {
    try {
      const client = getClient();
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYNTHESIS_SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 800,
      });
      const content = response.choices[0]?.message?.content;
      if (!content) {
        lastError = `No content returned from ${model}`;
        continue;
      }
      const parsed = parseLenientJson(content);
      if (!parsed) {
        lastError = `Failed to parse ${model} response as JSON`;
        continue;
      }
      const obj = parsed as Record<string, unknown>;
      return {
        companyOverview: asString(obj.companyOverview),
        techStack: asStringArray(obj.techStack),
        culture: asStringArray(obj.culture),
        whyThisRole: asString(obj.whyThisRole),
        yourEdge: asStringArray(obj.yourEdge),
        gapsToAddress: asStringArray(obj.gapsToAddress),
        smartQuestions: asStringArray(obj.smartQuestions),
        interviewPrep: asStringArray(obj.interviewPrep),
        sources: asStringArray(obj.sources),
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      lastError = msg;
      console.error(`[agent/research] synthesis ${model} failed:`, msg);
      if (!isRetryableModelError(msg)) break;
    }
  }
  console.error(
    `[agent/research] synthesis failed for ${job.company}: ${lastError} — returning empty dossier`,
  );
  return emptyDossier();
}

export async function researchCompany(
  job: ResearchJob,
  profile: ProfileForMatching,
): Promise<JobResearchDossier> {
  const sources: string[] = [];
  let homepage: HomepageData | null = null;
  const subPages: SubPageData[] = [];

  let stagehand: Awaited<ReturnType<typeof createStagehand>> | null = null;
  try {
    const browser = await launchResearchBrowser();
    stagehand = await createStagehand(browser);
    const pages = await browser.context.pages();
    const page = pages[0];
    if (!page) throw new Error("No page available in research browser");

    const homepageUrl = await resolveEmployerUrl(page, job.company, job.sourceUrl || null);
    sources.push(homepageUrl);

    try {
      await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
    } catch (error) {
      console.error(
        `[agent/research] goto ${homepageUrl} failed:`,
        error instanceof Error ? error.message : String(error),
      );
    }

    try {
      const { data } = await stagehand.extract(HOMEPAGE_INSTRUCTION, homepageSchema);
      homepage = data ?? null;
    } catch (error) {
      console.error(
        "[agent/research] homepage extract failed:",
        error instanceof Error ? error.message : String(error),
      );
    }

    const hasHomepageSignal =
      Boolean(homepage?.oneLiner?.trim()) ||
      Boolean(homepage?.productSummary?.trim());
    if (hasHomepageSignal && homepage) {
      for (const url of pickSubPages(homepage.pageLinks)) {
        try {
          await page.goto(url, { waitUntil: "domcontentloaded" });
        } catch (error) {
          console.error(
            `[agent/research] goto ${url} failed:`,
            error instanceof Error ? error.message : String(error),
          );
          continue;
        }
        sources.push(url);
        try {
          const { data } = await stagehand.extract(SUBPAGE_INSTRUCTION, subPageSchema);
          if (data) subPages.push(data);
        } catch (error) {
          console.error(
            `[agent/research] sub-page extract ${url} failed:`,
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    }
  } catch (error) {
    console.error(
      "[agent/research] browser session failed:",
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (error) {
        console.error(
          "[agent/research] stagehand.close failed:",
          error instanceof Error ? error.message : String(error),
        );
      }
    }
  }

  const companyResearch = { homepage, subPages, sources };
  const dossier = await synthesize(job, profile, companyResearch);
  if (dossier.sources.length === 0) {
    dossier.sources = sources;
  }
  return dossier;
}
