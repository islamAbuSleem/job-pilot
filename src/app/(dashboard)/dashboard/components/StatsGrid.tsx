export function StatsGrid() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="TOTAL JOBS" value="12" sub="3 this week" />
      <StatCard label="ANALYZED" value="8" sub="Avg fit 74/100" accent />
      <StatCard label="PROPOSALS" value="5" sub="2 ready to send" />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[20px] border p-5 ${
        accent
          ? "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10"
          : "border-stone-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:border-stone-800 dark:bg-stone-900"
      }`}
    >
      <p
        className={`text-xs font-semibold tracking-widest ${accent ? "text-amber-700 dark:text-amber-300" : "text-stone-500"}`}
      >
        {label}
      </p>
      <p className="mt-2 text-[28px] font-semibold tracking-tight leading-none">{value}</p>
      <p className={`mt-1 text-xs ${accent ? "text-amber-700/70 dark:text-amber-200/70" : "text-stone-500"}`}>{sub}</p>
    </div>
  );
}
