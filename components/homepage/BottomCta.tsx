import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  primaryHref: string;
  secondaryHref: string;
};

export function BottomCta({ primaryHref, secondaryHref }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 60%, #C9DCF8 0%, #F8D7E8 50%, #E5DBFF 100%)",
          opacity: 0.6,
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-8 py-24 text-center">
        <h2 className="text-[40px] md:text-[48px] font-bold leading-tight text-text-primary tracking-tight">
          Your next job search can feel a
          <br />
          lot less overwhelming
        </h2>
        <p className="mt-4 text-[16px] text-text-secondary">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
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
