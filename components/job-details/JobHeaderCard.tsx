import { Building2, ExternalLink } from "lucide-react";

type Props = {
  title: string;
  company: string;
  matchScore: number;
  externalApplyUrl: string;
};

export function JobHeaderCard({ title, company, matchScore, externalApplyUrl }: Props) {
  return (
    <section className="bg-surface border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-text-secondary" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-[24px] md:text-[28px] font-bold leading-tight tracking-tight text-text-primary">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] leading-5 text-text-secondary">
            <span className="font-medium text-text-primary">{company}</span>
            <span aria-hidden>•</span>
            <span
              className="inline-flex items-center rounded-full bg-success-lightest px-2 py-0.5 text-[12px] font-medium leading-4 text-success-foreground"
              aria-label={`${matchScore} percent match score`}
            >
              {matchScore}% Match Score
            </span>
          </div>
        </div>
      </div>
      <a
        href={externalApplyUrl || undefined}
        target={externalApplyUrl ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-disabled={!externalApplyUrl}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-surface border border-border px-4 py-2 text-[14px] font-medium leading-5 text-text-primary hover:bg-surface-secondary transition-colors w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <ExternalLink className="w-4 h-4" aria-hidden />
        View Job Post
      </a>
    </section>
  );
}
