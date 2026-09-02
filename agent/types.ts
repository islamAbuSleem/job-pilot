export type ScoredJob = {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};

export type ProfileForMatching = {
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: unknown;
  education: unknown;
  job_titles_seeking: string[] | null;
};
