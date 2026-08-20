import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Hero } from "./components/Hero";
import { PreviewCard } from "./components/PreviewCard";
import { HowItWorks } from "./components/HowItWorks";
import { SocialProofBar } from "./components/SocialProofBar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] dark:bg-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_60%),linear-gradient(to_bottom,_white,_#fafaf9)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_60%),linear-gradient(to_bottom,_#0c0a09,_#0c0a09)]" />
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)`,
              backgroundSize: `32px 32px`,
            }}
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <Hero />
            <PreviewCard />
          </div>
        </section>
        <HowItWorks />
        <SocialProofBar />
      </main>
      <SiteFooter />
    </div>
  );
}
