import { Badge } from "@/components/ui/badge";
import { MetricTile } from "./MetricTile";

export function PreviewCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 -z-10 rounded-[28px] bg-gradient-to-br from-amber-100 to-stone-100 blur-2xl dark:from-amber-950/20 dark:to-stone-900/40" />
      <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <Badge variant="stone" size="sm">
            ANALYSIS • ANTHROPIC/CLAUDE-3.5
          </Badge>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-500">SENIOR FRONTEND • ACME</p>
              <h3 className="mt-1 text-sm font-semibold leading-5">Fit Analysis — 82/100</h3>
            </div>
            <Badge variant="emerald">Strong fit</Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <MetricTile label="MATCHED" value="React, TS, Tailwind" tone="stone" />
            <MetricTile label="GAPS" value="Next.js 15, tRPC" tone="amber" />
            <MetricTile label="RISKS" value="Vague scope" tone="stone" />
          </div>
          <div className="mt-4 rounded-2xl border border-stone-100 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/30">
            <p className="text-xs font-semibold tracking-widest text-stone-500">PROPOSAL DRAFT — STREAMING</p>
            <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-300">
              Hi Acme team — I’m a frontend engineer with 4 years of React + TypeScript, recently shipping a Tailwind-heavy SaaS. Your Next.js + tRPC stack matches my recent work…
              <span className="inline-block h-3 w-0.5 translate-y-0.5 animate-pulse bg-stone-900 dark:bg-white" />
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="h-2 w-16 rounded-full bg-stone-900 dark:bg-white" />
            <span className="h-2 w-10 rounded-full bg-stone-200 dark:bg-stone-700" />
            <span className="h-2 w-8 rounded-full bg-amber-200 dark:bg-amber-800" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-stone-500">Pasted URL → cleaned in 0.9s • Streamed in 1.4s</p>
    </div>
  );
}
