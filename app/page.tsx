import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { DashboardPreview } from "@/components/homepage/DashboardPreview";
import { ManageSection } from "@/components/homepage/ManageSection";
import { ApplySection } from "@/components/homepage/ApplySection";
import { Testimonial } from "@/components/homepage/Testimonial";
import { BottomCta } from "@/components/homepage/BottomCta";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero primaryHref="/login" secondaryHref="/find-jobs" />
        <DashboardPreview />
        <ManageSection />
        <ApplySection />
        <Testimonial />
        <BottomCta primaryHref="/login" secondaryHref="/find-jobs" />
      </main>
      <Footer />
    </div>
  );
}
