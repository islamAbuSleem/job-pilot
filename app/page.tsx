import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { DashboardPreview } from "@/components/homepage/DashboardPreview";
import { ManageSection } from "@/components/homepage/ManageSection";
import { ApplySection } from "@/components/homepage/ApplySection";
import { Testimonial } from "@/components/homepage/Testimonial";
import { BottomCta } from "@/components/homepage/BottomCta";
import { PageviewTracker } from "@/components/PageviewTracker";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthed = Boolean(
    cookieStore.get("insforge_access_token")?.value,
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageviewTracker path="/" />
      <Navbar isAuthed={isAuthed} />
      <main className="flex-1">
        <Hero isAuthed={isAuthed} />
        <DashboardPreview />
        <ManageSection />
        <ApplySection />
        <Testimonial />
        <BottomCta isAuthed={isAuthed} />
      </main>
      <Footer />
    </div>
  );
}
