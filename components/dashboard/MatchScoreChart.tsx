"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export type MatchScoreBucket = {
  range: string;
  value: number;
};

type Props = {
  data: MatchScoreBucket[];
};

const TICKS = [0, 25, 50, 75, 100];

export function MatchScoreChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0);
  return (
    <section className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
        Match Score Distribution
      </h2>
      {!hasData ? (
        <p className="mt-4 text-[14px] leading-5 text-text-muted">
          No match scores yet.
        </p>
      ) : (
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="30%">
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="range"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                ticks={TICKS}
                tickLine={false}
                axisLine={false}
                width={32}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              />
              <Bar
                dataKey="value"
                fill="var(--color-success)"
                radius={[6, 6, 0, 0]}
                maxBarSize={64}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
