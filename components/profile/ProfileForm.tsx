"use client";

import { useState, useTransition } from "react";
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
import { saveProfile } from "@/actions/profile";
import { computeCompletion } from "@/lib/profile-completion";

type FormData = {
  personal: PersonalInfoData;
  professional: ProfessionalInfoData;
  work_experience: WorkExperienceRole[];
  education: EducationData;
  preferences: JobPreferencesData;
};

type Props = {
  initialData: FormData;
  resumeFile: File | null;
  onResumeFileChange: (file: File | null) => void;
  onCompletionChange?: (percentage: number, missing: string[]) => void;
};

const DEFAULT_DATA: FormData = {
  personal: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    work_authorization: "",
  },
  professional: {
    current_title: "",
    experience_level: "",
    years_experience: "",
    skills: [],
    industries: [],
  },
  work_experience: [],
  education: {
    highest_degree: "",
    field_of_study: "",
    institution_name: "",
    graduation_year: "",
  },
  preferences: {
    job_titles_seeking: [],
    remote_preference: "",
    salary_expectation: "",
    preferred_locations: [],
    cover_letter_tone: "",
  },
};

export function ProfileForm({ initialData, resumeFile, onResumeFileChange, onCompletionChange }: Props) {
  const [data, setData] = useState<FormData>(initialData ?? DEFAULT_DATA);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function notifyCompletion(next: FormData) {
    if (!onCompletionChange) return;
    const { percentage, missingFields } = computeCompletion({
      full_name: next.personal.full_name,
      phone: next.personal.phone,
      location: next.personal.location,
      current_title: next.professional.current_title,
      experience_level: next.professional.experience_level,
      years_experience: next.professional.years_experience,
      skills: next.professional.skills,
      work_experience: next.work_experience,
      highest_degree: next.education.highest_degree,
      field_of_study: next.education.field_of_study,
      job_titles_seeking: next.preferences.job_titles_seeking,
    });
    onCompletionChange(percentage, missingFields);
  }

  function handleSave() {
    setMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const fd = new FormData();
      fd.set("full_name", data.personal.full_name);
      fd.set("email", data.personal.email);
      fd.set("phone", data.personal.phone);
      fd.set("location", data.personal.location);
      fd.set("linkedin_url", data.personal.linkedin_url);
      fd.set("portfolio_url", data.personal.portfolio_url);
      fd.set("work_authorization", data.personal.work_authorization);
      fd.set("current_title", data.professional.current_title);
      fd.set("experience_level", data.professional.experience_level);
      fd.set("years_experience", data.professional.years_experience);
      fd.set("skills", JSON.stringify(data.professional.skills));
      fd.set("industries", JSON.stringify(data.professional.industries));
      fd.set("work_experience", JSON.stringify(data.work_experience));
      fd.set("highest_degree", data.education.highest_degree);
      fd.set("field_of_study", data.education.field_of_study);
      fd.set("institution_name", data.education.institution_name);
      fd.set("graduation_year", data.education.graduation_year);
      fd.set("job_titles_seeking", JSON.stringify(data.preferences.job_titles_seeking));
      fd.set("remote_preference", data.preferences.remote_preference);
      fd.set("salary_expectation", data.preferences.salary_expectation);
      fd.set("preferred_locations", JSON.stringify(data.preferences.preferred_locations));
      fd.set("cover_letter_tone", data.preferences.cover_letter_tone);
      if (resumeFile) fd.set("resume", resumeFile);

      const result = await saveProfile(fd);
      if (result.success) {
        setMessage({ type: "success", text: result.isComplete ? "Profile saved — complete!" : `Profile saved — ${result.percentage}% complete` });
        if (resumeFile) onResumeFileChange(null);
        notifyCompletion(data);
      } else {
        setMessage({ type: "error", text: result.error });
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
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
        {message && (
          <div
            role="alert"
            className={`mb-4 rounded-md border px-3 py-2 text-[13px] ${message.type === "success" ? "border-success-light bg-success-lightest text-success" : "border-border bg-surface-secondary text-error"}`}
          >
            {message.text}
          </div>
        )}
        {Object.keys(fieldErrors).length > 0 && (
          <div role="alert" className="mb-4 rounded-md border border-error bg-error-light px-3 py-2 text-[13px] text-error">
            {Object.entries(fieldErrors).map(([k, v]) => (
              <div key={k}>{k}: {v}</div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="w-full inline-flex items-center justify-center rounded-md bg-accent px-4 py-3 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
