import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
