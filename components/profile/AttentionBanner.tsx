import { AlertCircle, CheckCircle2 } from "lucide-react";

type Props = {
  percentage: number;
  missingFields: string[];
};

function CompletionRing({ percentage }: { percentage: number }) {
  const size = 120;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage / 100) * circumference;
  const isComplete = percentage === 100;

  return (
    <div className="relative w-[120px] h-[120px] shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-secondary)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? "var(--color-success)" : "var(--color-error)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[24px] font-semibold leading-7 text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export function AttentionBanner({ percentage, missingFields }: Props) {
  const isComplete = missingFields.length === 0;
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex items-start justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <AlertCircle className="w-5 h-5 text-error" />
          )}
          <h2 className={`text-[16px] font-semibold leading-6 ${isComplete ? "text-success" : "text-error"}`}>
            {isComplete ? "Profile complete" : "Profile needs attention"}
          </h2>
        </div>
        <p className="mt-2 text-[14px] leading-5 text-text-primary max-w-md">
          {isComplete
            ? "Your profile is complete and ready for tailored matches."
            : "Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes."}
        </p>
        {!isComplete && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="inline-flex items-center rounded-sm bg-error-light px-2 py-0.5 text-[12px] font-medium leading-4 text-error"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>
      <CompletionRing percentage={percentage} />
    </div>
  );
}
