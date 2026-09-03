import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageviewTracker } from "@/components/PageviewTracker";
import { BackLink } from "@/components/job-details/BackLink";
import { JobHeaderCard } from "@/components/job-details/JobHeaderCard";
import { InfoCardsRow } from "@/components/job-details/InfoCardsRow";
import { MatchReasonCard } from "@/components/job-details/MatchReasonCard";
import { SkillsCard } from "@/components/job-details/SkillsCard";
import { JobDescriptionCard } from "@/components/job-details/JobDescriptionCard";
import { CompanyResearchCard } from "@/components/job-details/CompanyResearchCard";
import { ApplyButton } from "@/components/job-details/ApplyButton";
import { createInsforgeServer } from "@/lib/insforge-server";
import { mapJobRow } from "@/lib/job-details";
import { formatJobType, formatRelative } from "@/lib/jobs-format";

type Params = { id: string };

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const isAuthed = Boolean(
    cookieStore.get("insforge_access_token")?.value,
  );

  let job: ReturnType<typeof mapJobRow> | null = null;
  try {
    const insforge = await createInsforgeServer();
    const { data, error } = await insforge
      .database
      .from("jobs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    job = data ? mapJobRow(data as never) : null;
  } catch {
    job = null;
  }

  if (!job) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageviewTracker path={`/find-jobs/${id}`} />
      <Navbar isAuthed={isAuthed} activePath="/find-jobs" />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1440px] px-8 py-12">
          <div className="mx-auto w-full max-w-[1080px] flex flex-col gap-6">
            <BackLink />
            <JobHeaderCard
              title={job.title}
              company={job.company}
              matchScore={job.matchScore}
              externalApplyUrl={job.externalApplyUrl}
            />
            <InfoCardsRow
              salary={job.salary || "—"}
              location={job.location}
              jobType={formatJobType(job.jobType)}
              dateFound={formatRelative(job.foundAt)}
            />
            <MatchReasonCard matchReason={job.matchReason} />
            <SkillsCard
              matchedSkills={job.matchedSkills}
              missingSkills={job.missingSkills}
            />
            <JobDescriptionCard
              description={job.aboutRole}
              externalApplyUrl={job.externalApplyUrl}
            />
            <CompanyResearchCard
              jobId={job.id}
              company={job.company}
              dossier={job.companyResearch}
            />
            <ApplyButton
              company={job.company}
              externalApplyUrl={job.externalApplyUrl}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
