import Image from "next/image";

export function Testimonial() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-16">
      <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 text-center">
        <p className="text-[12px] font-medium tracking-[0.2em] text-accent uppercase">
          Success Stories
        </p>
        <blockquote className="mt-6 max-w-3xl mx-auto text-[22px] md:text-[26px] font-medium leading-snug text-text-primary">
          &ldquo;I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.&rdquo;
        </blockquote>
        <div className="mt-8 flex flex-col items-center gap-2">
          <Image
            src="/images/user-icon.png"
            alt="Tom Wilson"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="text-[14px] font-semibold text-text-primary">
            Tom Wilson
          </div>
          <div className="text-[12px] text-text-muted">Junior Developer</div>
        </div>
      </div>
    </section>
  );
}
