import { Check, X } from "lucide-react";

type Props = {
  matchedSkills: string[];
  missingSkills: string[];
};

const HEADING =
  "text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary";
const SUBHEAD = "text-[14px] font-medium leading-5 text-text-secondary";

function MatchedPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-lightest px-2 py-0.5 text-[12px] font-medium leading-4 text-success-foreground">
      <Check className="w-3.5 h-3.5" aria-hidden />
      {label}
    </span>
  );
}

function MissingPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2 py-0.5 text-[12px] font-medium leading-4 text-accent">
      <X className="w-3.5 h-3.5" aria-hidden />
      {label}
    </span>
  );
}

export function SkillsCard({ matchedSkills, missingSkills }: Props) {
  return (
    <section className="bg-surface border border-border rounded-2xl p-6">
      <p className={HEADING}>Required Skills vs Your Profile</p>

      {matchedSkills.length > 0 ? (
        <div className="mt-4">
          <p className={SUBHEAD}>You have</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {matchedSkills.map((s) => (
              <MatchedPill key={s} label={s} />
            ))}
          </div>
        </div>
      ) : null}

      {missingSkills.length > 0 ? (
        <div className="mt-6">
          <p className={SUBHEAD}>Gap skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missingSkills.map((s) => (
              <MissingPill key={s} label={s} />
            ))}
          </div>
        </div>
      ) : null}

      {matchedSkills.length === 0 && missingSkills.length === 0 ? (
        <p className="mt-4 text-[14px] leading-5 text-text-muted">
          No skill breakdown available yet.
        </p>
      ) : null}
    </section>
  );
}
