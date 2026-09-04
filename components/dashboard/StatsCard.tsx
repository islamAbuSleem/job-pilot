type Props = {
  label: string;
  value: string;
  trend?: string;
  subtext?: string;
};

export function StatsCard({ label, value, trend, subtext }: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <p className="text-[14px] font-medium leading-5 text-text-secondary">
        {label}
      </p>
      <p className="mt-1 text-[30px] font-bold leading-9 text-text-primary">
        {value}
      </p>
      {trend ? (
        <p className="mt-2 flex items-center gap-2">
          <span className="rounded-sm bg-success-lightest px-2 py-0.5 text-[12px] font-medium leading-4 text-success-darker">
            {trend}
          </span>
          <span className="text-[12px] leading-4 text-text-muted">
            vs last week
          </span>
        </p>
      ) : subtext ? (
        <p className="mt-2 text-[12px] leading-4 text-text-muted">
          {subtext}
        </p>
      ) : null}
    </div>
  );
}
