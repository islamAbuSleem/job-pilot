import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  primaryHref: string;
  secondaryHref: string;
};

export function Hero({ primaryHref, secondaryHref }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #E5DBFF 0%, #F8D7E8 35%, #C9DCF8 70%, transparent 100%)",
          opacity: 0.7,
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-8 py-24 md:py-32 text-center">
        <h1 className="text-[44px] md:text-[64px] font-bold leading-[1.1] text-text-primary tracking-tight">
          Job hunting is hard.
          <br />
          Your tools shouldn&rsquo;t be.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-[16px] leading-6 text-text-secondary">
          Stop applying blind. JobPilot finds the jobs, researches the companies,
          and gives you everything you need to stand out.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 bg-text-primary text-surface text-[14px] font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center rounded-md px-5 py-2.5 bg-surface border border-border text-text-primary text-[14px] font-medium hover:bg-surface-secondary transition-colors"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
