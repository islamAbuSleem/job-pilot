"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { profileSchema } from "@/lib/profile-validation";
import { computeCompletion } from "@/lib/profile-completion";
import { captureServerEvent } from "@/lib/posthog-server";

export type SaveProfileResult =
  | { success: true; isComplete: boolean; percentage: number }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function saveProfile(formData: FormData): Promise<SaveProfileResult> {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const raw = {
      full_name: String(formData.get("full_name") ?? ""),
      email: String(formData.get("email") ?? user.email ?? ""),
      phone: String(formData.get("phone") ?? ""),
      location: String(formData.get("location") ?? ""),
      linkedin_url: String(formData.get("linkedin_url") ?? ""),
      portfolio_url: String(formData.get("portfolio_url") ?? ""),
      work_authorization: String(formData.get("work_authorization") ?? ""),
      current_title: String(formData.get("current_title") ?? ""),
      experience_level: String(formData.get("experience_level") ?? ""),
      years_experience: String(formData.get("years_experience") ?? ""),
      skills: JSON.parse(String(formData.get("skills") ?? "[]")),
      industries: JSON.parse(String(formData.get("industries") ?? "[]")),
      work_experience: JSON.parse(String(formData.get("work_experience") ?? "[]")),
      highest_degree: String(formData.get("highest_degree") ?? ""),
      field_of_study: String(formData.get("field_of_study") ?? ""),
      institution_name: String(formData.get("institution_name") ?? ""),
      graduation_year: String(formData.get("graduation_year") ?? ""),
      job_titles_seeking: JSON.parse(String(formData.get("job_titles_seeking") ?? "[]")),
      remote_preference: String(formData.get("remote_preference") ?? ""),
      salary_expectation: String(formData.get("salary_expectation") ?? ""),
      preferred_locations: JSON.parse(String(formData.get("preferred_locations") ?? "[]")),
      cover_letter_tone: String(formData.get("cover_letter_tone") ?? ""),
    };

    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      return { success: false, error: "Validation failed", fieldErrors };
    }

    const data = parsed.data;

    const yearsExp = typeof data.years_experience === "number" ? data.years_experience : parseInt(String(data.years_experience), 10) || 0;
    const gradYear = data.graduation_year ? parseInt(data.graduation_year, 10) || null : null;

    const workExpForDb = data.work_experience.map((r) => ({
      company: r.company,
      job_title: r.job_title,
      start_date: r.start_date,
      end_date: r.current ? null : r.end_date || null,
      current: r.current ?? false,
      key_responsibilities: r.key_responsibilities ?? "",
    }));

    const educationForDb = {
      highest_degree: data.highest_degree,
      field_of_study: data.field_of_study,
      institution_name: data.institution_name ?? "",
      graduation_year: gradYear ? String(gradYear) : data.graduation_year ?? "",
    };

    let resumePdfUrl: string | null = null;
    const resumeFile = formData.get("resume") as File | null;
    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.type !== "application/pdf") {
        return { success: false, error: "Only PDF files are allowed" };
      }
      if (resumeFile.size > 5 * 1024 * 1024) {
        return { success: false, error: "File must be smaller than 5MB" };
      }
      const path = `${user.id}/resume.pdf`;
      const { data: uploadData, error: uploadError } = await insforge.storage
        .from("resumes")
        .upload(path, resumeFile);
      if (uploadError) {
        console.error("[actions/profile] upload failed", uploadError.message);
        return { success: false, error: "Failed to upload resume" };
      }
      void uploadData;
      resumePdfUrl = path;
    }

    const completion = computeCompletion({
      full_name: data.full_name,
      phone: data.phone,
      location: data.location,
      current_title: data.current_title,
      experience_level: data.experience_level,
      years_experience: yearsExp,
      skills: data.skills,
      work_experience: workExpForDb,
      highest_degree: data.highest_degree,
      field_of_study: data.field_of_study,
      job_titles_seeking: data.job_titles_seeking,
      email: data.email,
    });

    const existing = await insforge.database.from("profiles").select("is_complete, resume_pdf_url").eq("id", user.id).single();
    const wasComplete = existing.data?.is_complete === true;

    const payload: Record<string, unknown> = {
      id: user.id,
      full_name: data.full_name,
      email: data.email || user.email,
      phone: data.phone,
      location: data.location,
      current_title: data.current_title,
      experience_level: data.experience_level,
      years_experience: yearsExp,
      skills: data.skills,
      industries: data.industries,
      work_experience: workExpForDb,
      education: educationForDb,
      job_titles_seeking: data.job_titles_seeking,
      remote_preference: data.remote_preference || null,
      preferred_locations: data.preferred_locations,
      salary_expectation: data.salary_expectation || null,
      cover_letter_tone: data.cover_letter_tone || null,
      linkedin_url: data.linkedin_url || null,
      portfolio_url: data.portfolio_url || null,
      work_authorization: data.work_authorization || null,
      is_complete: completion.isComplete,
      updated_at: new Date().toISOString(),
    };
    if (resumePdfUrl) {
      payload.resume_pdf_url = resumePdfUrl;
    } else if (existing.data?.resume_pdf_url) {
      payload.resume_pdf_url = existing.data.resume_pdf_url;
    }

    if (existing.data) {
      const { error: updateError } = await insforge.database.from("profiles").update(payload as never).eq("id", user.id);
      if (updateError) {
        console.error("[actions/profile] update failed", updateError.message);
        return { success: false, error: "Failed to save profile" };
      }
    } else {
      const { error: insertError } = await insforge.database.from("profiles").insert([payload as never]);
      if (insertError) {
        console.error("[actions/profile] insert failed", insertError.message);
        return { success: false, error: "Failed to save profile" };
      }
    }

    if (!wasComplete && completion.isComplete) {
      await captureServerEvent(user.id, "profile_completed", { userId: user.id });
    }

    revalidatePath("/profile");

    return { success: true, isComplete: completion.isComplete, percentage: completion.percentage };
  } catch (error) {
    console.error("[actions/profile] saveProfile failed", error);
    return { success: false, error: "Failed to save profile" };
  }
}
