"use client";

import { useState } from "react";
import { AttentionBanner } from "./AttentionBanner";
import { ProfileForm } from "./ProfileForm";
import { ResumeCard } from "./ResumeCard";
import { computeCompletion } from "@/lib/profile-completion";

type FormData = {
  personal: { full_name: string; email: string; phone: string; location: string; linkedin_url: string; portfolio_url: string; work_authorization: string };
  professional: { current_title: string; experience_level: string; years_experience: string; skills: string[]; industries: string[] };
  work_experience: Array<{ id: string; company: string; job_title: string; start_date: string; end_date: string; current: boolean; key_responsibilities: string }>;
  education: { highest_degree: string; field_of_study: string; institution_name: string; graduation_year: string };
  preferences: { job_titles_seeking: string[]; remote_preference: string; salary_expectation: string; preferred_locations: string[]; cover_letter_tone: string };
};

type Props = {
  initialData: FormData;
  resumeUrl?: string | null;
  initialCompletion: { percentage: number; missingFields: string[] };
};

export function ProfileEditor({ initialData, resumeUrl, initialCompletion }: Props) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [completion, setCompletion] = useState(initialCompletion);

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6">
      <AttentionBanner percentage={completion.percentage} missingFields={completion.missingFields} />
      <ResumeCard file={resumeFile} onFileChange={setResumeFile} existingUrl={resumeUrl} />
      <ProfileForm
        initialData={initialData}
        resumeFile={resumeFile}
        onResumeFileChange={setResumeFile}
        onCompletionChange={(p, m) => setCompletion({ percentage: p, missingFields: m })}
      />
    </div>
  );
}
