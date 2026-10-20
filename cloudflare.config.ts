import { bindings, defineConfig, defineWorker, type TextBinding } from "cf/config";

/**
 * "Job Pilot" on Cloudflare Workers.
 *
 *   npm run build:vinext  -> builds the Workers bundle
 *   npx cf deploy         -> publishes it
 *
 * The backend is InsForge (hosted Postgres BaaS), so there is no API to
 * deploy - only the web app. The `NEXT_PUBLIC_*` values are inlined into the
 * bundle at build time; everything else is a runtime secret uploaded with
 * `cf deploy --secrets-file`.
 */

const text = (name: string, fallback = ""): TextBinding<string> => ({
  type: "text",
  value: process.env[name] ?? fallback,
});

export default defineConfig({
  worker: defineWorker({
    name: "job-pilot",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-19",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      POSTHOG_HOST: text("POSTHOG_HOST"),
      ASSETS: bindings.assets(),
    },
  }),
});
