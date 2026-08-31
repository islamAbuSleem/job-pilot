import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { generateResumeContent } from "@/lib/resume-generation";
import { renderToBuffer } from "@react-pdf/renderer";
import ResumePDF from "./resume-pdf";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user ?? null;
    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("[resume/generate] profile read failed:", profileError?.message);
      return NextResponse.json(
        { success: false, error: "Profile not found. Save your profile before generating a resume." },
        { status: 400 }
      );
    }

    const profileData = {
      full_name: profile.full_name ?? "",
      current_title: profile.current_title ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      skills: profile.skills ?? [],
      work_experience: profile.work_experience ?? [],
      education: profile.education ?? {},
      years_experience: profile.years_experience ?? 0,
      job_titles_seeking: profile.job_titles_seeking ?? [],
    };

    const result = await generateResumeContent(profileData);
    if (!result.success || !result.data) {
      console.error("[resume/generate] LLM generation failed:", result.error);
      return NextResponse.json(
        { success: false, error: result.error ?? "Failed to generate resume content" },
        { status: 502 }
      );
    }

    const buffer = await renderToBuffer(<ResumePDF data={{ ...result.data, full_name: profile.full_name ?? undefined, current_title: profile.current_title ?? undefined }} />);

    const path = `${user.id}/resume.pdf`;
    const file = new File([buffer as never], "resume.pdf", { type: "application/pdf" });
    const { error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(path, file);

    if (uploadError) {
      console.error("[resume/generate] storage upload failed:", uploadError.message);
      return NextResponse.json(
        { success: false, error: "Failed to upload generated resume" },
        { status: 500 }
      );
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: path, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      console.error("[resume/generate] profile update failed:", updateError.message);
      return NextResponse.json(
        { success: false, error: "Failed to update profile with new resume" },
        { status: 500 }
      );
    }

    revalidatePath("/profile");

    return NextResponse.json({ success: true, path });
  } catch (error) {
    console.error("[resume/generate] Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
