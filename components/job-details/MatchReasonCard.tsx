import { Sparkles } from "lucide-react";

type Props = {
  matchReason: string;
};

export function MatchReasonCard({ matchReason }: Props) {
  return (
    <section className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" aria-hidden />
        <span className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">
          AI Match Reasoning
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-6 text-text-primary">
        {matchReason || "No reasoning available yet."}
      </p>
    </section>
  );
}
