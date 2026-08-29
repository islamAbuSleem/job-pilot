"use client";

import { ChevronDown } from "lucide-react";

export type PersonalInfoData = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  work_authorization: string;
};

type Props = {
  data: PersonalInfoData;
  onChange: (patch: Partial<PersonalInfoData>) => void;
};

const WORK_AUTHORIZATION_OPTIONS = [
  { value: "citizen", label: "Citizen" },
  { value: "permanent_resident", label: "Permanent Resident" },
  { value: "visa_required", label: "Visa Required" },
];

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelClass =
  "block text-[12px] font-medium leading-4 text-text-secondary tracking-wide uppercase";

export function PersonalInfo({ data, onChange }: Props) {
  return (
    <section>
      <h3 className="text-[16px] font-semibold leading-6 text-text-primary">
        Personal Info
      </h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className={labelClass}>
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            value={data.full_name}
            onChange={(e) => onChange({ full_name: e.target.value })}
            placeholder="Faizan Ali"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            readOnly
            className={`mt-1.5 ${inputClass} bg-surface-secondary text-text-secondary cursor-default`}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            type="text"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="City, Country"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="linkedin_url" className={labelClass}>
            LinkedIn URL
          </label>
          <input
            id="linkedin_url"
            type="url"
            value={data.linkedin_url}
            onChange={(e) => onChange({ linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/faizan"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="portfolio_url" className={labelClass}>
            Portfolio / GitHub
          </label>
          <input
            id="portfolio_url"
            type="url"
            value={data.portfolio_url}
            onChange={(e) => onChange({ portfolio_url: e.target.value })}
            placeholder="https://github.com/jsmastery"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="work_authorization" className={labelClass}>
            Work Authorization
          </label>
          <div className="relative mt-1.5">
            <select
              id="work_authorization"
              value={data.work_authorization}
              onChange={(e) => onChange({ work_authorization: e.target.value })}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="">Select…</option>
              {WORK_AUTHORIZATION_OPTIONS.map((opt) => (
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
