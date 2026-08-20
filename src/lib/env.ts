import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (postgres URL)"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required (openssl rand -base64 32)"),
  AUTH_URL: z.string().optional(),
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Env validation failed: ${msg}`);
  }
  // Warn if OAuth is partially configured
  const hasGoogleId = !!parsed.data.GOOGLE_CLIENT_ID;
  const hasGoogleSecret = !!parsed.data.GOOGLE_CLIENT_SECRET;
  if (hasGoogleId !== hasGoogleSecret) {
    console.warn("Env warning: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET should both be set or both unset");
  }
  const hasGithubId = !!parsed.data.GITHUB_ID;
  const hasGithubSecret = !!parsed.data.GITHUB_SECRET;
  if (hasGithubId !== hasGithubSecret) {
    console.warn("Env warning: GITHUB_ID and GITHUB_SECRET should both be set or both unset");
  }
  cached = parsed.data;
  return cached;
}

// For testing: allow clearing cache
export function _clearEnvCache() {
  cached = null;
}
