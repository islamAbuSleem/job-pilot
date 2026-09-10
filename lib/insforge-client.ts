import { createBrowserClient } from "@insforge/sdk/ssr";

// The InsForge SDK requires a customRefreshUrl to use the app's own
// /api/auth/refresh route. This is essential because:
// - The SDK's browser client calls the InsForge-hosted refresh endpoint directly
// - The httpOnly insforge_refresh_token cookie is set on the app domain
// - When the SDK calls the InsForge endpoint directly, it sends no cookies
// - This causes a 401 "No refresh token provided" error
// - Our rerouteBackendRefresh mechanism can't intercept this flow
// - Using customRefreshUrl tells the SDK to use our route instead, which
//   reads the insforge_refresh_token cookie server-side and refreshes tokens

export const insforge = createBrowserClient({
  customRefreshUrl: "/api/auth/refresh",
});
