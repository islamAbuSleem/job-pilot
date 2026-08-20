import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <div className="text-left">
      <Badge variant="amber" withDot dotColor="bg-amber-500">
        Paste → Analyze → Proposal in under 2 min
      </Badge>
      <h1 className="mt-5 text-[36px] font-semibold leading-[0.95] tracking-[-0.03em] text-stone-900 dark:text-white sm:text-[52px]">
        Turn any job
        <br />
        into a{" "}
        <span className="relative inline-block">
          tailored proposal{" "}
          <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-amber-200/60 dark:bg-amber-400/20" />
        </span>
      </h1>
      <p className="mt-5 max-w-xl text-[17px] leading-7 text-stone-600 dark:text-stone-400">
        Paste job text or a URL, pick your resume, and get a structured fit analysis plus a streamed proposal grounded in your real profile — not hallucinations.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-7 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-stone-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.14)] dark:bg-white dark:text-stone-900"
        >
          Start with a job — it’s free
        </Link>
        <Link
          href="/signin"
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-7 text-sm font-medium hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
        >
          See demo analysis
        </Link>
      </div>
      <div className="mt-6 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          No credit card
        </span>
        <span>•</span>
        <span>Email + Google + GitHub</span>
        <span>•</span>
        <span>OpenRouter multi-model</span>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="h-7 w-7 rounded-full border-2 border-white bg-stone-200 dark:border-stone-900 dark:bg-stone-800" />
          <div className="h-7 w-7 rounded-full border-2 border-white bg-stone-300 dark:border-stone-900 dark:bg-stone-700" />
          <div className="h-7 w-7 rounded-full border-2 border-white bg-amber-200 dark:border-stone-900 dark:bg-amber-900/40" />
        </div>
        <p className="text-xs leading-4 text-stone-600 dark:text-stone-400">
          Trusted by devs shipping <span className="font-semibold text-stone-900 dark:text-white">3+ proposals/week</span>
        </p>
      </div>
    </div>
  );
}
