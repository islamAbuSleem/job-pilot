import { StatsCard } from "./StatsCard";

export type StatItem = {
  label: string;
  value: string;
  trend?: string;
  subtext?: string;
};

type Props = {
  stats: StatItem[];
};

export function StatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          subtext={stat.subtext}
        />
      ))}
    </div>
  );
}
