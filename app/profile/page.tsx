import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { computeCompletion } from "@/lib/profile-completion";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();
  const { data: profile } = user ? await insforge.database.from("profiles").select("*").eq("id", user.id).single() : { data: null } as never;

  let signedResumeUrl: string | null = null;
  if (profile?.resume_pdf_url) {
    const stored = String(profile.resume_pdf_url);
    let path = stored;
    if (stored.startsWith("http")) {
      try {
        const url = new URL(stored);
        const idx = url.pathname.indexOf("/resumes/");
        if (idx !== -1) {
          path = decodeURIComponent(url.pathname.slice(idx + "/resumes/".length));
        } else {
          const parts = url.pathname.split("/");
          const last = parts[parts.length - 1];
          if (last) path = `${user?.id ?? ""}/${last}`;
        }
      } catch {
        path = stored;
      }
    }
    if (path && user) {
      const { data } = await insforge.storage.from("resumes").createSignedUrl(path, 3600);
      signedResumeUrl = data?.signedUrl ?? null;
      if (!signedResumeUrl) signedResumeUrl = stored.startsWith("http") ? stored : null;
    }
  }

  const initialData = profile
    ? {
        personal: {
          full_name: profile.full_name ?? "",
          email: profile.email ?? user?.email ?? "",
          phone: profile.phone ?? "",
          location: profile.location ?? "",
          linkedin_url: profile.linkedin_url ?? "",
          portfolio_url: profile.portfolio_url ?? "",
          work_authorization: profile.work_authorization ?? "",
        },
        professional: {
          current_title: profile.current_title ?? "",
          experience_level: profile.experience_level ?? "",
          years_experience: profile.years_experience != null ? String(profile.years_experience) : "",
          skills: profile.skills ?? [],
          industries: profile.industries ?? [],
        },
        work_experience: Array.isArray(profile.work_experience)
          ? profile.work_experience.map((r: Record<string, unknown>, i: number) => ({
              id: String((r as { id?: string }).id ?? `we-${i}`),
              company: String((r as { company?: string }).company ?? ""),
              job_title: String((r as { job_title?: string }).job_title ?? (r as { job_title?: string }).job_title ?? ""),
              start_date: String((r as { start_date?: string }).start_date ?? ""),
              end_date: String((r as { end_date?: string }).end_date ?? ""),
              current: Boolean((r as { current?: boolean }).current),
              key_responsibilities: String((r as { key_responsibilities?: string }).key_responsibilities ?? ""),
            }))
          : [],
        education: {
          highest_degree: (profile.education as Record<string, string> | null)?.highest_degree ?? "",
          field_of_study: (profile.education as Record<string, string> | null)?.field_of_study ?? "",
          institution_name: (profile.education as Record<string, string> | null)?.institution_name ?? "",
          graduation_year: (profile.education as Record<string, string> | null)?.graduation_year ?? "",
        },
        preferences: {
          job_titles_seeking: profile.job_titles_seeking ?? [],
          remote_preference: profile.remote_preference ?? "",
          salary_expectation: profile.salary_expectation ?? "",
          preferred_locations: profile.preferred_locations ?? [],
          cover_letter_tone: profile.cover_letter_tone ?? "",
        },
      }
    : {
        personal: { full_name: "", email: user?.email ?? "", phone: "", location: "", linkedin_url: "", portfolio_url: "", work_authorization: "" },
        professional: { current_title: "", experience_level: "", years_experience: "", skills: [], industries: [] },
        work_experience: [],
        education: { highest_degree: "", field_of_study: "", institution_name: "", graduation_year: "" },
        preferences: { job_titles_seeking: [], remote_preference: "", salary_expectation: "", preferred_locations: [], cover_letter_tone: "" },
      };

  const completion = computeCompletion(
    profile
      ? {
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          current_title: profile.current_title,
          experience_level: profile.experience_level,
          years_experience: profile.years_experience,
          skills: profile.skills,
          work_experience: profile.work_experience,
          highest_degree: (profile.education as Record<string, string> | null)?.highest_degree,
          field_of_study: (profile.education as Record<string, string> | null)?.field_of_study,
          job_titles_seeking: profile.job_titles_seeking,
        }
      : {
          full_name: initialData.personal.full_name,
          phone: initialData.personal.phone,
          location: initialData.personal.location,
          current_title: initialData.professional.current_title,
          experience_level: initialData.professional.experience_level,
          years_experience: initialData.professional.years_experience,
          skills: initialData.professional.skills,
          work_experience: initialData.work_experience,
          highest_degree: initialData.education.highest_degree,
          field_of_study: initialData.education.field_of_study,
          job_titles_seeking: initialData.preferences.job_titles_seeking,
        },
  );

  const isAuthed = Boolean(user);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthed={isAuthed} />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1440px] px-8 py-12">
          <ProfileEditor initialData={initialData} resumeUrl={signedResumeUrl} initialCompletion={completion} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
