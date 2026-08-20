"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";

// TODO(BE): replace with real job + analysis/proposal data from NestJS
const MOCK_JOB = {
  id: "1",
  title: "Senior Frontend — Acme",
  company: "Acme Inc.",
  url: "https://acme.com/careers",
  rawText: "We need a senior frontend engineer…",
};

const TABS = [{ id: "overview", label: "Overview" }, { id: "analysis", label: "Analysis" }, { id: "proposal", label: "Proposal" }];

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [tab, setTab] = useState("overview");
  void params; // consumed by Next.js routing — real job data TBD in Unit 5

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/jobs" className="text-xs text-stone-500 hover:underline">← Back to Jobs</Link>
      <div className="mt-2 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">{MOCK_JOB.title}</h1>
          <p className="mt-1 text-sm text-stone-500">{MOCK_JOB.company}</p>
        </div>
        <Badge variant="emerald">Strong fit</Badge>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-semibold tracking-widest text-stone-500">SOURCE</p>
          <a href={MOCK_JOB.url} target="_blank" rel="noreferrer" className="mt-1 text-sm text-stone-700 underline dark:text-stone-300">{MOCK_JOB.url}</a>
          <p className="mt-4 text-xs font-semibold tracking-widest text-stone-500">DESCRIPTION</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-stone-700 dark:text-stone-300">{MOCK_JOB.rawText}</p>
        </div>
      )}
      {tab === "analysis" && (
        <EmptyTab title="Analysis" desc="Run analysis to see fit score, matched skills, gaps, and red flags." />
      )}
      {tab === "proposal" && (
        <EmptyTab title="Proposal" desc="Generate a tailored proposal grounded in your profile." />
      )}
    </div>
  );
}

function EmptyTab({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-stone-500">{desc}</p>
      <button className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
        {title === "Proposal" ? "Generate proposal" : "Analyze fit"}
      </button>
    </div>
  );
}
