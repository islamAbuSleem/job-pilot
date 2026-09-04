import Link from "next/link";
import { AlertCircle } from "lucide-react";

export function IncompleteProfileBanner() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0">
          <p className="text-[16px] font-semibold leading-6 text-text-primary">
            Complete your profile to unlock better matches
          </p>
          <p className="mt-1 text-[14px] leading-5 text-text-secondary">
            Add your missing details so the agent can find and score the right
            jobs for you.
          </p>
        </div>
      </div>
      <Link
        href="/profile"
        className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-[14px] font-medium leading-5 text-text-primary hover:bg-surface-secondary transition-colors w-full sm:w-auto shrink-0"
      >
        Complete profile
      </Link>
    </div>
  );
}
