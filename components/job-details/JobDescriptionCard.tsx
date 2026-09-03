"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";

type Props = {
  description: string;
  externalApplyUrl: string;
};

const CLAMP_LINES = 6;

export function JobDescriptionCard({ description, externalApplyUrl }: Props) {
  const [overflows, setOverflows] = useState<boolean | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const fullHeight = el.scrollHeight;
    const clampedHeight = lineHeight * CLAMP_LINES;
    setOverflows(fullHeight - clampedHeight > 1);
  }, [description]);

  const clampActive = overflows === true;

  return (
    <section className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-text-secondary" aria-hidden />
        <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
          Job Description
        </h2>
      </div>
      {description ? (
        <>
          <p
            ref={bodyRef}
            className={
              clampActive
                ? "mt-3 text-[14px] leading-6 text-text-primary whitespace-pre-line line-clamp-6"
                : "mt-3 text-[14px] leading-6 text-text-primary whitespace-pre-line"
            }
          >
            {description}
          </p>
          {externalApplyUrl ? (
            <a
              href={externalApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium leading-5 text-accent hover:text-accent-dark transition-colors"
            >
              View full description on the main site
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          ) : null}
        </>
      ) : (
        <p className="mt-3 text-[14px] leading-5 text-text-muted">
          No description available for this role.
        </p>
      )}
    </section>
  );
}
