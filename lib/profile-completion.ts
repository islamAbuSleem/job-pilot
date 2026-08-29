type ProfileLike = {
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  current_title?: string | null;
  experience_level?: string | null;
  years_experience?: number | string | null;
  skills?: string[] | null;
  work_experience?: unknown;
  highest_degree?: string | null;
  field_of_study?: string | null;
  job_titles_seeking?: string[] | null;
  email?: string | null;
};

const REQUIRED_CHECKS: Array<{ key: string; label: string; check: (p: ProfileLike) => boolean }> = [
  { key: "full_name", label: "FULL NAME", check: (p) => Boolean(p.full_name?.trim()) },
  { key: "phone", label: "PHONE", check: (p) => Boolean(p.phone?.trim()) },
  { key: "location", label: "LOCATION", check: (p) => Boolean(p.location?.trim()) },
  { key: "current_title", label: "TITLE", check: (p) => Boolean(p.current_title?.trim()) },
  { key: "experience_level", label: "EXPERIENCE", check: (p) => Boolean(p.experience_level) },
  {
    key: "years_experience",
    label: "YEARS",
    check: (p) => p.years_experience !== null && p.years_experience !== undefined && String(p.years_experience).trim() !== "",
  },
  { key: "skills", label: "SKILLS", check: (p) => Array.isArray(p.skills) && p.skills.length > 0 },
  {
    key: "work_experience",
    label: "EXPERIENCE",
    check: (p) => {
      if (!p.work_experience) return false;
      if (Array.isArray(p.work_experience)) return p.work_experience.length > 0;
      try {
        const parsed = typeof p.work_experience === "string" ? JSON.parse(p.work_experience) : p.work_experience;
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    },
  },
  { key: "education", label: "EDUCATION", check: (p) => Boolean(p.highest_degree && p.field_of_study) },
  { key: "job_titles_seeking", label: "JOB TITLES", check: (p) => Array.isArray(p.job_titles_seeking) && p.job_titles_seeking.length > 0 },
];

export function computeCompletion(profile: ProfileLike | null): {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
} {
  if (!profile) {
    return { percentage: 0, missingFields: REQUIRED_CHECKS.map((c) => c.label), isComplete: false };
  }
  const missing = REQUIRED_CHECKS.filter((c) => !c.check(profile)).map((c) => c.label);
  const filled = REQUIRED_CHECKS.length - missing.length;
  const percentage = Math.round((filled / REQUIRED_CHECKS.length) * 100);
  return { percentage, missingFields: missing, isComplete: missing.length === 0 };
}
