"use client";

import { ChevronDown } from "lucide-react";
import { TagInput } from "../TagInput";

export type ProfessionalInfoData = {
  current_title: string;
  experience_level: string;
  years_experience: string;
  skills: string[];
  industries: string[];
};

type Props = {
  data: ProfessionalInfoData;
  onChange: (patch: Partial<ProfessionalInfoData>) => void;
};

const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelClass =
  "block text-[12px] font-medium leading-4 text-text-secondary tracking-wide uppercase";

export function ProfessionalInfo({ data, onChange }: Props) {
  return (
    <section>
      <h3 className="text-[16px] font-semibold leading-6 text-text-primary">
        Professional Info
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="current_title" className={labelClass}>
            Current/Recent Job Title
          </label>
          <input
            id="current_title"
            type="text"
            value={data.current_title}
            onChange={(e) => onChange({ current_title: e.target.value })}
            placeholder="Frontend Engineer"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="experience_level" className={labelClass}>
              Experience Level
            </label>
            <div className="relative mt-1.5">
              <select
                id="experience_level"
                value={data.experience_level}
                onChange={(e) => onChange({ experience_level: e.target.value })}
                className={`${inputClass} appearance-none pr-9`}
              >
                <option value="">Select…</option>
                {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            </div>
          </div>
          <div>
            <label htmlFor="years_experience" className={labelClass}>
              Years of Experience
            </label>
            <input
              id="years_experience"
              type="number"
              min={0}
              max={60}
              value={data.years_experience}
              onChange={(e) => onChange({ years_experience: e.target.value })}
              placeholder="4"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="skills" className={labelClass}>
            Skills
          </label>
          <div className="mt-1.5">
            <TagInput
              id="skills"
              value={data.skills}
              onChange={(tags) => onChange({ skills: tags })}
              placeholder="Add a skill"
            />
          </div>
        </div>
        <div>
          <label htmlFor="industries" className={labelClass}>
            Industries Worked in (Optional)
          </label>
          <div className="mt-1.5">
            <TagInput
              id="industries"
              value={data.industries}
              onChange={(tags) => onChange({ industries: tags })}
              placeholder="E.g. FinTech, Healthcare"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
