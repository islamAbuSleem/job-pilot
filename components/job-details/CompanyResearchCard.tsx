import { Briefcase, Building2, Search } from "lucide-react";
import type { JobResearchDossier } from "@/lib/job-details";

type Props = {
  company: string;
  dossier: JobResearchDossier | null;
};

export function CompanyResearchCard({ company, dossier }: Props) {
  return (
    <section className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent" aria-hidden />
          <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
            Company Research
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-[14px] font-medium leading-5 text-accent-foreground opacity-60 cursor-not-allowed w-full sm:w-auto"
          aria-label="Research Company (coming in a future update)"
        >
          <Search className="w-4 h-4" aria-hidden />
          Research Company
        </button>
      </div>
      <div className="border-t border-border p-6">
        {dossier ? <DossierView dossier={dossier} /> : <EmptyState company={company} />}
      </div>
    </section>
  );
}

function EmptyState({ company }: { company: string }) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center">
        <Building2 className="w-6 h-6 text-text-secondary" aria-hidden />
      </div>
      <p className="mt-3 text-[16px] font-semibold leading-6 text-text-primary">
        No research yet
      </p>
      <p className="mt-1 max-w-md text-[14px] leading-5 text-text-secondary">
        Click &ldquo;Research Company&rdquo; to let the AI browse{" "}
        <span className="text-text-primary font-medium">{company}</span>&rsquo;s public
        pages and build a dossier.
      </p>
    </div>
  );
}

function DossierView({ dossier }: { dossier: JobResearchDossier }) {
  return (
    <div className="flex flex-col gap-6">
      {dossier.companyOverview ? (
        <DossierBlock label="Company Overview">
          <p className="text-[14px] leading-6 text-text-primary">
            {dossier.companyOverview}
          </p>
        </DossierBlock>
      ) : null}

      {dossier.techStack.length > 0 ? (
        <DossierBlock label="Tech Stack">
          <div className="flex flex-wrap gap-2">
            {dossier.techStack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-accent-light px-2 py-0.5 text-[12px] font-medium leading-4 text-accent"
              >
                {t}
              </span>
            ))}
          </div>
        </DossierBlock>
      ) : null}

      {dossier.culture.length > 0 ? (
        <DossierBlock label="Culture">
          <BulletList items={dossier.culture} />
        </DossierBlock>
      ) : null}

      {dossier.whyThisRole ? (
        <DossierBlock label="Why This Role">
          <p className="text-[14px] leading-6 text-text-primary">
            {dossier.whyThisRole}
          </p>
        </DossierBlock>
      ) : null}

      {dossier.yourEdge.length > 0 ? (
        <DossierBlock label="Your Edge" highlight>
          <BulletList items={dossier.yourEdge} />
        </DossierBlock>
      ) : null}

      {dossier.gapsToAddress.length > 0 ? (
        <DossierBlock label="Gaps to Address">
          <BulletList items={dossier.gapsToAddress} />
        </DossierBlock>
      ) : null}

      {dossier.smartQuestions.length > 0 ? (
        <DossierBlock label="Smart Questions">
          <BulletList items={dossier.smartQuestions} />
        </DossierBlock>
      ) : null}

      {dossier.interviewPrep.length > 0 ? (
        <DossierBlock label="Interview Prep">
          <BulletList items={dossier.interviewPrep} />
        </DossierBlock>
      ) : null}

      {dossier.sources.length > 0 ? (
        <DossierBlock label="Sources">
          <ul className="flex flex-col gap-1">
            {dossier.sources.map((src) => (
              <li key={src} className="text-[12px] leading-4 text-text-muted break-all">
                {src}
              </li>
            ))}
          </ul>
        </DossierBlock>
      ) : null}
    </div>
  );
}

function DossierBlock({
  label,
  children,
  highlight = false,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-lg border border-accent-light bg-accent-muted/50 p-4"
          : undefined
      }
    >
      <p className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 flex flex-col gap-1 text-[14px] leading-6 text-text-primary">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
