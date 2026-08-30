import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { extractResumePath } from "@/lib/resume-path";

export const runtime = "nodejs";

export async function POST() {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user ?? null;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const { data: profile } = await insforge.database
      .from("profiles")
      .select("resume_pdf_url")
      .eq("id", user.id)
      .single();

    const path = extractResumePath(profile?.resume_pdf_url, user.id);

    if (path) {
      const { error: removeError } = await insforge.storage
        .from("resumes")
        .remove([path]);
      if (removeError) {
        console.error("[resume/delete] storage remove failed:", removeError.message);
        return NextResponse.json(
          { success: false, error: "Failed to delete resume from storage" },
          { status: 500 },
        );
      }
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: null, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (updateError) {
      console.error("[resume/delete] profile update failed:", updateError.message);
      return NextResponse.json(
        { success: false, error: "Failed to clear resume reference" },
        { status: 500 },
      );
    }

    revalidatePath("/profile");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[resume/delete] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}