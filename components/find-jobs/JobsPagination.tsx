import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

function buildPageList(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 1) return [];
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  for (const p of [1, 2, total - 1, total]) pages.add(p);
  pages.add(current);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function JobsPagination({ page, pageCount, onChange }: Props) {
  const pages = buildPageList(page, pageCount);
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const baseBtn =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-md text-[14px] font-medium leading-5 transition-colors";
  const inactiveBtn = "bg-surface text-text-primary hover:bg-surface-secondary";
  const activeBtn = "bg-accent-light text-accent";
  const ghostBtn = "bg-surface text-text-secondary hover:bg-surface-secondary";

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => canPrev && onChange(page - 1)}
        disabled={!canPrev}
        className={`${baseBtn} ${canPrev ? inactiveBtn : ghostBtn} disabled:opacity-50 disabled:cursor-not-allowed gap-1`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-text-muted text-[14px]">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${baseBtn} ${p === page ? activeBtn : inactiveBtn}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => canNext && onChange(page + 1)}
        disabled={!canNext}
        className={`${baseBtn} ${canNext ? inactiveBtn : ghostBtn} disabled:opacity-50 disabled:cursor-not-allowed gap-1`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
