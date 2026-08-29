"use client";

import { useState } from "react";
import {
  Education,
  type EducationData,
} from "./sections/Education";
import {
  JobPreferences,
  type JobPreferencesData,
} from "./sections/JobPreferences";
import {
  PersonalInfo,
  type PersonalInfoData,
} from "./sections/PersonalInfo";
import {
  ProfessionalInfo,
  type ProfessionalInfoData,
} from "./sections/ProfessionalInfo";
import {
  WorkExperience,
  type WorkExperienceRole,
} from "./sections/WorkExperience";

type FormData = {
  personal: PersonalInfoData;
  professional: ProfessionalInfoData;
  work_experience: WorkExperienceRole[];
  education: EducationData;
  preferences: JobPreferencesData;
};

const INITIAL_DATA: FormData = {
  personal: {
    full_name: "Faizan Ali",
    email: "faizan@jmastery.pro",
    phone: "+1 (555) 000-0000",
    location: "Lahore, Pakistan",
    linkedin_url: "https://linkedin.com/in/faizan",
    portfolio_url: "https://github.com/jsmastery",
    work_authorization: "citizen",
  },
  professional: {
    current_title: "Frontend Engineer",
    experience_level: "junior",
    years_experience: "4",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    industries: [],
  },
  work_experience: [
    {
      id: "seed-1",
      company: "Vercel",
      job_title: "Frontend Engineer",
      start_date: "2022-01",
      end_date: "",
      current: true,
      key_responsibilities:
        "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
    },
  ],
  education: {
    highest_degree: "high_school",
    field_of_study: "Computer Science",
    institution_name: "",
    graduation_year: "",
  },
  preferences: {
    job_titles_seeking: ["Frontend Engineer", "React Developer"],
    remote_preference: "any",
    salary_expectation: "",
    preferred_locations: [],
    cover_letter_tone: "",
  },
};

export function ProfileForm() {
  const [data, setData] = useState<FormData>(INITIAL_DATA);

  function handleSave() {
    console.log(
      "[profile] save stubbed — Feature 06 will wire this up",
      data,
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
        Profile Information
      </h2>
      <p className="mt-1 text-[14px] leading-5 text-text-secondary">
        This context is used to accurately represent you in agent
        interactions.
      </p>
      <div className="mt-6 flex flex-col gap-8">
        <PersonalInfo
          data={data.personal}
          onChange={(patch) =>
            setData((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }))
          }
        />
        <div className="border-t border-border" />
        <ProfessionalInfo
          data={data.professional}
          onChange={(patch) =>
            setData((prev) => ({
              ...prev,
              professional: { ...prev.professional, ...patch },
            }))
          }
        />
        <div className="border-t border-border" />
        <WorkExperience
          roles={data.work_experience}
          onChange={(roles) => setData((prev) => ({ ...prev, work_experience: roles }))}
        />
        <div className="border-t border-border" />
        <Education
          data={data.education}
          onChange={(patch) =>
            setData((prev) => ({
              ...prev,
              education: { ...prev.education, ...patch },
            }))
          }
        />
        <div className="border-t border-border" />
        <JobPreferences
          data={data.preferences}
          onChange={(patch) =>
            setData((prev) => ({
              ...prev,
              preferences: { ...prev.preferences, ...patch },
            }))
          }
        />
      </div>
      <div className="mt-8 border-t border-border pt-6">
        <button
          type="button"
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center rounded-md bg-accent px-4 py-3 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
