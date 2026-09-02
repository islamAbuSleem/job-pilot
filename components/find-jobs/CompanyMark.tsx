import { Building2 } from "lucide-react";

type Props = {
  name: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

export function CompanyMark({ name }: Props) {
  return (
    <div className="w-10 h-10 rounded-lg bg-surface-secondary border border-border flex items-center justify-center shrink-0">
      <Building2 className="w-5 h-5 text-text-secondary" aria-hidden />
      <span className="sr-only">{initials(name)}</span>
    </div>
  );
}
