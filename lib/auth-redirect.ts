export const POST_AUTH_COOKIE = "insforge_post_auth_redirect";

const FORBIDDEN_CHARS = /[\s\\]/;
const FORBIDDEN_ENCODED = /%2f|%5c/i;

export function sanitizeNextPath(value: string | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.length > 512) return null;
  if (FORBIDDEN_CHARS.test(value)) return null;
  if (FORBIDDEN_ENCODED.test(value)) return null;
  return value;
}
