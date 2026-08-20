"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// TODO(BE): wire to POST /api/jobs
export default function NewJobPage() {
  const [mode, setMode] = useState<"text" | "url">("text");

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/jobs" className="text-xs text-stone-500 hover:underline">← Back to Jobs</Link>
      <h1 className="mt-2 text-[22px] font-semibold tracking-tight">New Job</h1>
      <p className="mt-1 text-sm text-stone-500">Paste the job description or URL.</p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setMode("text")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mode === "text" ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900" : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"}`}
        >
          Paste text
        </button>
        <button
          onClick={() => setMode("url")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mode === "url" ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900" : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"}`}
        >
          Paste URL
        </button>
      </div>

      <form className="mt-5 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {mode === "text" ? (
          <div>
            <Label>Job description</Label>
            <Textarea className="mt-2 min-h-[200px]" placeholder="Paste the full job posting here…" />
          </div>
        ) : (
          <div>
            <Label>Job URL</Label>
            <Input className="mt-2" type="url" placeholder="https://company.com/jobs/…" />
            <p className="mt-1 text-xs text-stone-500">Only public URLs — private/internal links are blocked.</p>
          </div>
        )}
        <div>
          <Label>Resume (optional)</Label>
          <select className="mt-2 flex h-10 w-full rounded-full border border-stone-200 bg-white px-4 text-sm dark:border-stone-800 dark:bg-stone-900">
            <option>Default resume</option>
          </select>
        </div>
        <Button type="submit" variant="default" className="mt-2 w-full">Create job & analyze</Button>
      </form>
    </div>
  );
}
