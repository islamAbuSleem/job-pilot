export function HowItWorks() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
          <p className="text-sm text-stone-500">Paste once. Reuse your profile everywhere.</p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Step number="1" title="Paste job" description="Raw text or any public URL. We strip nav, normalize title/company, and keep source." />
          <Step number="2" title="Analyze fit" description="Streaming score 0-100, matched skills, gaps to address, strengths, and red flags vs your selected resume." highlighted />
          <Step number="3" title="Generate proposal" description="Auto-detects freelance bid vs cover letter, streams an editable draft you can copy or download." />
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
  highlighted = false,
}: {
  number: string;
  title: string;
  description: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border p-5 transition ${
        highlighted
          ? "border-amber-100 bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10"
          : "border-stone-100 bg-stone-50 hover:bg-white hover:shadow-sm dark:border-stone-800 dark:bg-stone-800/30 dark:hover:bg-stone-800"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
          highlighted ? "bg-amber-500 text-white" : "bg-white dark:bg-stone-900"
        }`}
      >
        {number}
      </div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-stone-600 dark:text-stone-400">{description}</p>
    </div>
  );
}
