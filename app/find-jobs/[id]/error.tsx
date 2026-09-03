"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import posthog from "posthog-js";

export default function JobDetailsError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-8">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-error" aria-hidden />
          <h1 className="text-[16px] font-semibold leading-6 text-error">
            Job details failed to load
          </h1>
        </div>
        <p className="mt-2 text-[14px] leading-5 text-text-primary">
          Something went wrong while loading this job. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 inline-flex items-center rounded-md bg-accent px-4 py-2 text-[14px] font-medium text-accent-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
