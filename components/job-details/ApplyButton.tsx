import { ExternalLink } from "lucide-react";

type Props = {
  company: string;
  externalApplyUrl: string;
};

export function ApplyButton({ company, externalApplyUrl }: Props) {
  if (!externalApplyUrl) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 text-center text-[14px] leading-5 text-text-muted">
        No apply link available for this role.
      </div>
    );
  }
  return (
    <a
      href={externalApplyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors w-full"
    >
      <ExternalLink className="w-4 h-4" aria-hidden />
      Apply Now at {company}
    </a>
  );
}
