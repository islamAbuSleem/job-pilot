export function MatchScoreBar({ score }: { score: number }) {
  const fillColor =
    score >= 80
      ? "bg-success"
      : score >= 60
        ? "bg-info"
        : "bg-warning";
  const textColor =
    score >= 90
      ? "text-success"
      : score >= 70
        ? "text-success"
        : score >= 60
          ? "text-info"
          : score >= 50
            ? "text-warning"
            : "text-text-muted";

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="h-1 flex-1 max-w-[120px] rounded-full bg-border-light overflow-hidden">
        <div
          className={`h-full rounded-full ${fillColor}`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      <span className={`text-[14px] font-medium leading-5 tabular-nums ${textColor}`}>
        {score}%
      </span>
    </div>
  );
}
