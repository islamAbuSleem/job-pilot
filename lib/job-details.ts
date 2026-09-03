export type JobResearchDossier = {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
};

export type JobDetails = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  aboutRole: string;
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  externalApplyUrl: string;
  sourceUrl: string;
  foundAt: string;
  companyResearch: JobResearchDossier | null;
};

type JobDbRow = {
  id: string;
  title: string | null;
  company: string | null;
  location: string | null;
  salary: string | null;
  job_type: string | null;
  about_role: string | null;
  match_score: number | null;
  match_reason: string | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
  external_apply_url: string | null;
  source_url: string | null;
  found_at: string;
  company_research: JobResearchDossier | null;
};

export function mapJobRow(row: JobDbRow): JobDetails {
  const applyUrl =
    typeof row.external_apply_url === "string" && row.external_apply_url
      ? row.external_apply_url
      : typeof row.source_url === "string"
        ? row.source_url
        : "";
  return {
    id: String(row.id),
    title: typeof row.title === "string" && row.title ? row.title : "Untitled role",
    company:
      typeof row.company === "string" && row.company ? row.company : "Unknown company",
    location: typeof row.location === "string" ? row.location : "",
    salary: typeof row.salary === "string" ? row.salary : "",
    jobType: typeof row.job_type === "string" ? row.job_type : "",
    aboutRole: typeof row.about_role === "string" ? row.about_role : "",
    matchScore: typeof row.match_score === "number" ? row.match_score : 50,
    matchReason: typeof row.match_reason === "string" ? row.match_reason : "",
    matchedSkills: Array.isArray(row.matched_skills) ? row.matched_skills : [],
    missingSkills: Array.isArray(row.missing_skills) ? row.missing_skills : [],
    externalApplyUrl: applyUrl,
    sourceUrl: typeof row.source_url === "string" ? row.source_url : "",
    foundAt: row.found_at,
    companyResearch: row.company_research,
  };
}
