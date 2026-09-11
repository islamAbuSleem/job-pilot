import { createBrowserClient } from "@insforge/sdk/ssr";

const APP_REFRESH_URL = "/api/auth/refresh";

// Why: the core client's 401-retry path (InsForgeClient.refreshAccessToken)
// resolves relative "/api/auth/refresh" against the InsForge host
// (buildUrl does `new URL(path, baseUrl)`), so the browser POSTs cross-origin
// without the app-domain httpOnly refresh cookie and the host answers 401
// "No refresh token provided". Reroute those POSTs to the app's own refresh
// route, which reads the cookie server-side and exchanges it for fresh tokens.
function rerouteBackendRefresh(fetchImpl: typeof fetch): typeof fetch {
  const origin = process.env.NEXT_PUBLIC_INSFORGE_URL?.replace(/\/+$/, "");
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const method =
      init?.method ?? (input instanceof Request ? input.method : undefined);
    if (
      origin !== undefined &&
      method?.toUpperCase() === "POST" &&
      url.startsWith(`${origin}/api/auth/refresh`)
    ) {
      return fetchImpl(APP_REFRESH_URL, { ...init, credentials: "include" });
    }
    return fetchImpl(input, init);
  };
}

export const insforge = createBrowserClient({
  fetch: rerouteBackendRefresh(globalThis.fetch.bind(globalThis)),
});
