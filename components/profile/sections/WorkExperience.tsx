"use client";

import { Plus } from "lucide-react";

export type WorkExperienceRole = {
  id: string;
  company: string;
  job_title: string;
  start_date: string;
  end_date: string;
  current: boolean;
  key_responsibilities: string;
};

type Props = {
  roles: WorkExperienceRole[];
  onChange: (roles: WorkExperienceRole[]) => void;
};

const MAX_ROLES = 3;

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelClass =
  "block text-[12px] font-medium leading-4 text-text-secondary tracking-wide uppercase";

function patchRole(
  roles: WorkExperienceRole[],
  id: string,
  patch: Partial<WorkExperienceRole>,
): WorkExperienceRole[] {
  return roles.map((r) => (r.id === id ? { ...r, ...patch } : r));
}

export function WorkExperience({ roles, onChange }: Props) {
  const atMax = roles.length >= MAX_ROLES;

  function add() {
    if (atMax) return;
    onChange([
      ...roles,
      {
        id: crypto.randomUUID(),
        company: "",
        job_title: "",
        start_date: "",
        end_date: "",
        current: false,
        key_responsibilities: "",
      },
    ]);
  }

  function remove(id: string) {
    onChange(roles.filter((r) => r.id !== id));
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold leading-6 text-text-primary">
          Work Experience
        </h3>
        {!atMax && (
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1 text-[14px] font-medium leading-5 text-accent hover:text-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add role
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {roles.length === 0 && (
          <p className="text-[14px] leading-5 text-text-muted">
            No work experience added yet. Click “Add role” to get started.
          </p>
        )}
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-lg border border-border p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`company-${role.id}`} className={labelClass}>
                  Company Name
                </label>
                <input
                  id={`company-${role.id}`}
                  type="text"
                  value={role.company}
                  onChange={(e) =>
                    onChange(patchRole(roles, role.id, { company: e.target.value }))
                  }
                  placeholder="Vercel"
                  className={`mt-1.5 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor={`job_title-${role.id}`} className={labelClass}>
                  Job Title
                </label>
                <input
                  id={`job_title-${role.id}`}
                  type="text"
                  value={role.job_title}
                  onChange={(e) =>
                    onChange(patchRole(roles, role.id, { job_title: e.target.value }))
                  }
                  placeholder="Frontend Engineer"
                  className={`mt-1.5 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor={`start_date-${role.id}`} className={labelClass}>
                  Start Date
                </label>
                <input
                  id={`start_date-${role.id}`}
                  type="date"
                  value={role.start_date}
                  onChange={(e) =>
                    onChange(patchRole(roles, role.id, { start_date: e.target.value }))
                  }
                  className={`mt-1.5 ${inputClass}`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor={`end_date-${role.id}`} className={labelClass}>
                    End Date
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[12px] font-medium leading-4 text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.current}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        onChange(
                          patchRole(roles, role.id, {
                            current: checked,
                            end_date: checked ? "" : role.end_date,
                          }),
                        );
                      }}
                      className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent"
                    />
                    Currently working here
                  </label>
                </div>
                <input
                  id={`end_date-${role.id}`}
                  type="date"
                  value={role.end_date}
                  disabled={role.current}
                  onChange={(e) =>
                    onChange(patchRole(roles, role.id, { end_date: e.target.value }))
                  }
                  className={`mt-1.5 ${inputClass} disabled:bg-surface-secondary disabled:text-text-muted disabled:cursor-not-allowed`}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`responsibilities-${role.id}`} className={labelClass}>
                  Key Responsibilities
                </label>
                <textarea
                  id={`responsibilities-${role.id}`}
                  rows={3}
                  value={role.key_responsibilities}
                  onChange={(e) =>
                    onChange(
                      patchRole(roles, role.id, { key_responsibilities: e.target.value }),
                    )
                  }
                  placeholder="Built Next.js features and optimized web vitals. Led a team of 3 developers."
                  className={`mt-1.5 ${inputClass} resize-y`}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => remove(role.id)}
                className="text-[13px] font-medium leading-5 text-text-muted hover:text-error transition-colors"
              >
                Remove role
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
