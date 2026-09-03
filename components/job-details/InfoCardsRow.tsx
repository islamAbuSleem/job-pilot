import { Briefcase, Calendar, DollarSign, MapPin } from "lucide-react";

type Props = {
  salary: string;
  location: string;
  jobType: string;
  dateFound: string;
};

const ICON_WRAP = "w-10 h-10 rounded-lg flex items-center justify-center shrink-0";
const TITLE = "text-[16px] font-semibold leading-6 text-text-primary truncate";
const LABEL =
  "mt-1 text-[12px] font-medium leading-4 tracking-wide uppercase text-text-muted";

export function InfoCardsRow({ salary, location, jobType, dateFound }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
        <div className={`${ICON_WRAP} bg-success-light text-success`}>
          <DollarSign className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className={TITLE}>{salary || "—"}</p>
          <p className={LABEL}>Salary Est.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
        <div className={`${ICON_WRAP} bg-info-light text-info-dark`}>
          <MapPin className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className={TITLE}>{location || "—"}</p>
          <p className={LABEL}>Location</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
        <div className={`${ICON_WRAP} bg-accent-light text-accent`}>
          <Briefcase className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className={TITLE}>{jobType || "—"}</p>
          <p className={LABEL}>Job Type</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
        <div className={`${ICON_WRAP} bg-surface-tertiary text-text-secondary`}>
          <Calendar className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className={TITLE}>{dateFound || "—"}</p>
          <p className={LABEL}>Date Found</p>
        </div>
      </div>
    </div>
  );
}
