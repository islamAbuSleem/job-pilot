import Image from "next/image";

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-[1440px] px-8">
      <div className="rounded-2xl overflow-hidden bg-surface border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <Image
          src="/images/dashboard-demo.png"
          alt="JobPilot dashboard preview"
          width={1200}
          height={760}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
