import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  href?: string;
  label?: string;
};

export function BackLink({ href = "/find-jobs", label = "Back to Jobs" }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[14px] font-medium leading-5 text-text-secondary hover:text-text-primary transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
