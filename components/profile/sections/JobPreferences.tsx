"use client";

import { ChevronDown } from "lucide-react";
import { TagInput } from "../TagInput";

export type JobPreferencesData = {
  job_titles_seeking: string[];
  remote_preference: string;
  salary_expectation: string;
  preferred_locations: string[];
  cover_letter_tone: string;
};

type Props = {
  data: JobPreferencesData;
  onChange: (patch: Partial<JobPreferencesData>) => void;
};

const REMOTE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
  { value: "any", label: "Any" },
];

const TONE_OPTIONS = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelClass =
  "block text-[12px] font-medium leading-4 text-text-secondary tracking-wide uppercase";

export function JobPreferences({ data, onChange }: Props) {
  return (
    <section>
      <h3 className="text-[16px] font-semibold leading-6 text-text-primary">
        Job Preferences
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="job_titles_seeking" className={labelClass}>
            Job Titles Seeking
          </label>
          <div className="mt-1.5">
            <TagInput
              id="job_titles_seeking"
              value={data.job_titles_seeking}
              onChange={(tags) => onChange({ job_titles_seeking: tags })}
              placeholder="Frontend Engineer, React Developer"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="remote_preference" className={labelClass}>
              Remote Preference
            </label>
            <div className="relative mt-1.5">
              <select
                id="remote_preference"
                value={data.remote_preference}
                onChange={(e) => onChange({ remote_preference: e.target.value })}
                className={`${inputClass} appearance-none pr-9`}
              >
                <option value="">Select…</option>
                {REMOTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            </div>
          </div>
          <div>
            <label htmlFor="salary_expectation" className={labelClass}>
              Salary Expectation (Optional)
            </label>
            <input
              id="salary_expectation"
              type="text"
              value={data.salary_expectation}
              onChange={(e) => onChange({ salary_expectation: e.target.value })}
              placeholder="E.g. $120k+"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="preferred_locations" className={labelClass}>
            Preferred Locations (Optional)
          </label>
          <div className="mt-1.5">
            <TagInput
              id="preferred_locations"
              value={data.preferred_locations}
              onChange={(tags) => onChange({ preferred_locations: tags })}
              placeholder="E.g. New York, London"
            />
          </div>
        </div>
        <div>
          <label htmlFor="cover_letter_tone" className={labelClass}>
            Cover Letter Tone
          </label>
          <div className="relative mt-1.5">
            <select
              id="cover_letter_tone"
              value={data.cover_letter_tone}
              onChange={(e) => onChange({ cover_letter_tone: e.target.value })}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="">Select…</option>
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}
