import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @napi-rs/canvas ships a native .node binding that Turbopack cannot bundle.
  // Marking it external keeps it loaded via runtime require at execution time.
  // @browserbasehq/stagehand resolves extension assets via
  // `new URL("../", import.meta.url)`, which Turbopack cannot statically
  // resolve — same treatment: load it externally at runtime.
  serverExternalPackages: [
    "@napi-rs/canvas",
    "pdfjs-dist",
    "@browserbasehq/stagehand",
    "@browserbasehq/sdk",
  ],
  async rewrites() {
    const posthogHost =
      process.env.POSTHOG_HOST ?? process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!posthogHost) return [];
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogHost}/static/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
