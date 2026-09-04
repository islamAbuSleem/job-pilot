"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export type JobsOverTimePoint = {
  day: string;
  value: number;
};

type Props = {
  data: JobsOverTimePoint[];
};

const TICKS = [0, 25, 50, 75, 100];

export function JobsOverTimeChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0);
  return (
    <section className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
        Jobs Found Over Time
      </h2>
      {!hasData ? (
        <p className="mt-4 text-[14px] leading-5 text-text-muted">
          No jobs found yet.
        </p>
      ) : (
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="jobsOverTimeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="day"
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-accent)"
                strokeWidth={3}
                fill="url(#jobsOverTimeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
