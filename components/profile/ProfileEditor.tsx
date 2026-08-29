"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  resumePath?: string | null;
  initialCompletion: { percentage: number; missingFields: string[] };
};

export function ProfileEditor({ initialData, resumeUrl, resumePath, initialCompletion }: Props) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [completion, setCompletion] = useState(initialCompletion);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [resumeRemoved, setResumeRemoved] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [savedResumeUrl, setSavedResumeUrl] = useState<string | null | undefined>(resumeUrl);
  const [savedResumePath, setSavedResumePath] = useState<string | null | undefined>(resumePath);
  const router = useRouter();

  useEffect(() => {
    function onExtracted(e: Event) {
      const data = (e as CustomEvent<Record<string, unknown>>).detail;
      if (!data) return;
      const mapped: FormData = {
        personal: {
          full_name: String(data.full_name ?? ""),
          email: String(data.email ?? formData.personal.email),
          phone: String(data.phone ?? ""),
          location: String(data.location ?? ""),
          linkedin_url: String(data.linkedin_url ?? ""),
          portfolio_url: String(data.portfolio_url ?? ""),
          work_authorization: String(data.work_authorization ?? ""),
        },
        professional: {
          current_title: String(data.current_title ?? ""),
          experience_level: String(data.experience_level ?? ""),
          years_experience: data.years_experience != null ? String(data.years_experience) : "",
          skills: Array.isArray(data.skills) ? data.skills.map(String) : [],
          industries: Array.isArray(data.industries) ? data.industries.map(String) : [],
        },
        work_experience: Array.isArray(data.work_experience)
          ? data.work_experience.map((r: Record<string, unknown>, i: number) => ({
              id: String((r as { id?: string }).id ?? `extracted-${i}`),
              company: String((r as { company?: string }).company ?? ""),
              job_title: String((r as { job_title?: string }).job_title ?? ""),
              start_date: String((r as { start_date?: string }).start_date ?? ""),
              end_date: String((r as { end_date?: string }).end_date ?? ""),
              current: Boolean((r as { current?: boolean }).current),
              key_responsibilities: String((r as { key_responsibilities?: string }).key_responsibilities ?? ""),
            }))
          : [],
        education: {
          highest_degree: String((data.education as Record<string, string> | undefined)?.highest_degree ?? ""),
          field_of_study: String((data.education as Record<string, string> | undefined)?.field_of_study ?? ""),
          institution_name: String((data.education as Record<string, string> | undefined)?.institution_name ?? ""),
          graduation_year: String((data.education as Record<string, string> | undefined)?.graduation_year ?? ""),
        },
        preferences: {
          job_titles_seeking: Array.isArray(data.job_titles_seeking) ? data.job_titles_seeking.map(String) : [],
          remote_preference: String(data.remote_preference ?? ""),
          salary_expectation: String(data.salary_expectation ?? ""),
          preferred_locations: Array.isArray(data.preferred_locations) ? data.preferred_locations.map(String) : [],
          cover_letter_tone: String(data.cover_letter_tone ?? ""),
        },
      };
      setFormData(mapped);
    }

    window.addEventListener("resume-extracted", onExtracted);
    return () => window.removeEventListener("resume-extracted", onExtracted);
  }, [formData.personal.email]);

  async function handleDeleteResume() {
    if (isDeleting) return;
    if (typeof window !== "undefined" && !window.confirm("Remove your saved resume? This cannot be undone.")) {
      return;
    }
    startDelete(async () => {
      try {
        const res = await fetch("/api/resume/delete", { method: "POST", credentials: "include" });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Delete failed");
        setResumeRemoved(true);
        router.refresh();
      } catch (err) {
        console.error("[ProfileEditor] resume delete failed:", err);
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6">
      <AttentionBanner percentage={completion.percentage} missingFields={completion.missingFields} />
      <ResumeCard
        file={resumeFile}
        onFileChange={setResumeFile}
        existingUrl={resumeRemoved ? null : savedResumeUrl ?? null}
        canDelete={Boolean(savedResumePath ?? resumePath)}
        isDeleting={isDeleting}
        onDelete={handleDeleteResume}
      />
      <ProfileForm
        initialData={formData}
        resumeFile={resumeFile}
        onResumeFileChange={setResumeFile}
        onCompletionChange={(p, m) => setCompletion({ percentage: p, missingFields: m })}
        onSaved={(result) => {
          if (result.resumeUploaded) {
            setResumeFile(null);
            setSavedResumeUrl(result.resumeUrl);
            setSavedResumePath(result.resumePath);
            setResumeRemoved(false);
          }
        }}
      />
    </div>
  );
}