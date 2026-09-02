export { MATCH_THRESHOLD } from "@/lib/jobs-query";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
