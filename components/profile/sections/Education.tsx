"use client";

import { ChevronDown } from "lucide-react";

export type EducationData = {
  highest_degree: string;
  field_of_study: string;
  institution_name: string;
  graduation_year: string;
};

type Props = {
  data: EducationData;
  onChange: (patch: Partial<EducationData>) => void;
};

const DEGREE_OPTIONS = [
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "doctorate", label: "Doctorate" },
];

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelClass =
  "block text-[12px] font-medium leading-4 text-text-secondary tracking-wide uppercase";

export function Education({ data, onChange }: Props) {
  return (
    <section>
      <h3 className="text-[16px] font-semibold leading-6 text-text-primary">
        Education
      </h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="highest_degree" className={labelClass}>
            Highest Degree
          </label>
          <div className="relative mt-1.5">
            <select
              id="highest_degree"
              value={data.highest_degree}
              onChange={(e) => onChange({ highest_degree: e.target.value })}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="">Select…</option>
              {DEGREE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
        </div>
        <div>
          <label htmlFor="field_of_study" className={labelClass}>
            Field of Study
          </label>
          <input
            id="field_of_study"
            type="text"
            value={data.field_of_study}
            onChange={(e) => onChange({ field_of_study: e.target.value })}
            placeholder="Computer Science"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="institution_name" className={labelClass}>
            Institution Name
          </label>
          <input
            id="institution_name"
            type="text"
            value={data.institution_name}
            onChange={(e) => onChange({ institution_name: e.target.value })}
            placeholder="E.g. State University"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="graduation_year" className={labelClass}>
            Graduation Year
          </label>
          <input
            id="graduation_year"
            type="number"
            min={1950}
            max={2099}
            value={data.graduation_year}
            onChange={(e) => onChange({ graduation_year: e.target.value })}
            placeholder="YYYY"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>
    </section>
  );
}
