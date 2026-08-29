import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { AttentionBanner } from "@/components/profile/AttentionBanner";
import { ResumeCard } from "@/components/profile/ResumeCard";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  const cookieStore = await cookies();
  const isAuthed = Boolean(
    cookieStore.get("insforge_access_token")?.value,
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthed={isAuthed} />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1440px] px-8 py-12">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6">
            <AttentionBanner />
            <ResumeCard />
            <ProfileForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
