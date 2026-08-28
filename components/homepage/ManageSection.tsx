import Image from "next/image";

const items = [
  {
    title: "Find jobs that actually fit",
    body: "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
  },
  {
    title: "Know the Company Before You Apply",
    body: "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
  },
  {
    title: "Keep track of every application",
    body: "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
  },
];

export function ManageSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-[40px] md:text-[48px] font-bold leading-tight text-text-primary tracking-tight">
            Manage Your Job
            <br />
            Search With Ease
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

        <div className="rounded-2xl overflow-hidden bg-surface border border-border">
          <Image
            src="/images/jobs-lists.png"
            alt="Jobs list preview"
            width={720}
            height={560}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
