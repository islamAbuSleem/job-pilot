import Image from "next/image";

const items = [
  {
    title: "Understand your match score",
    body: "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
  },
  {
    title: "AI-Powered Job Matching",
    body: "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
  },
  {
    title: "Focus on the right roles",
    body: "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
  },
];

export function ApplySection() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden bg-surface border border-border order-2 md:order-1">
          <Image
            src="/images/agnet-log.png"
            alt="Agent log preview"
            width={720}
            height={560}
            className="w-full h-auto"
          />
        </div>

        <div className="order-1 md:order-2">
          <h2 className="text-[40px] md:text-[48px] font-bold leading-tight text-text-primary tracking-tight">
            Apply With More
            <br />
            Confidence, Every Time
          </h2>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.title}
                className="bg-surface border border-border rounded-2xl p-6"
              >
                <h3 className="text-[16px] font-semibold leading-6 text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-5 text-text-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
