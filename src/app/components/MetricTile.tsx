type MetricTone = "stone" | "amber";

export function MetricTile({
  label,
  value,
  tone = "stone",
}: {
  label: string;
  value: string;
  tone?: MetricTone;
}) {
  const toneClasses =
    tone === "amber"
      ? "bg-amber-50 dark:bg-amber-950/20"
      : "bg-stone-50 dark:bg-stone-800/50";
  const labelColor =
    tone === "amber"
      ? "text-amber-700 dark:text-amber-300"
      : "text-stone-500";
  return (
    <div className={`rounded-2xl p-3 text-center ${toneClasses}`}>
      <p className={`text-[11px] font-semibold tracking-widest ${labelColor}`}>{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
