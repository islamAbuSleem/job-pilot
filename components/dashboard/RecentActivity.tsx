export type ActivityTone = "accent" | "info" | "success";

export type ActivityEntry = {
  id: string;
  text: string;
  time: string;
  tone: ActivityTone;
};

type Props = {
  entries: ActivityEntry[];
};

const DOT_STYLES: Record<ActivityTone, { outer: string; inner: string }> = {
  accent: { outer: "bg-accent-light", inner: "bg-accent" },
  info: { outer: "bg-info-light", inner: "bg-info" },
  success: { outer: "bg-success-light", inner: "bg-success-alt" },
};

export function RecentActivity({ entries }: Props) {
  return (
    <section className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
        Recent Activity
      </h2>
      {entries.length === 0 ? (
        <p className="mt-4 text-[14px] leading-5 text-text-muted">
          No activity yet. Run your first job search to get started.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-5">
          {entries.map((entry) => {
            const dot = DOT_STYLES[entry.tone];
            return (
              <li key={entry.id} className="flex items-start gap-3">
                <span
                  className={`mt-1 w-4 h-4 rounded-full ${dot.outer} border border-white flex items-center justify-center shrink-0`}
                  aria-hidden
                >
                  <span className={`w-2 h-2 rounded-full ${dot.inner}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium leading-5 text-text-primary">
                    {entry.text}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-4 text-text-muted">
                    {entry.time}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
