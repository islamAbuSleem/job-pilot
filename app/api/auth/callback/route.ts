import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";
import { POST_AUTH_COOKIE, sanitizeNextPath } from "@/lib/auth-redirect";
import { captureServerEvent } from "@/lib/posthog-server";

function redirectWithClearedCookies(
  request: NextRequest,
  destination: string,
  errorParam?: string,
): NextResponse {
  const url = new URL(destination, request.url);
  if (errorParam) url.searchParams.set("error", errorParam);
  const response = NextResponse.redirect(url);
  response.cookies.delete("insforge_code_verifier");
  response.cookies.delete(POST_AUTH_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError || !code) {
    if (oauthError) {
      console.warn("[auth/callback] OAuth callback failed", { error: oauthError });
    }
    await captureServerEvent("anonymous", "oauth_failed", {
      reason: oauthError ?? "missing_code",
    });
    return redirectWithClearedCookies(request, "/login", "oauth_failed");
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("insforge_code_verifier")?.value;
  if (!codeVerifier) {
    await captureServerEvent("anonymous", "oauth_failed", {
      reason: "missing_verifier",
    });
    return redirectWithClearedCookies(request, "/login", "missing_verifier");
  }

  const rawNext = cookieStore.get(POST_AUTH_COOKIE)?.value;
  const safeNext = sanitizeNextPath(rawNext) ?? "/dashboard";
  const response = NextResponse.redirect(new URL(safeNext, request.url));

  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);
  if (error || !data?.user) {
    if (error) {
      console.error("[auth/callback] OAuth code exchange failed", error?.message);
    }
    await captureServerEvent("anonymous", "oauth_failed", {
      reason: "exchange_failed",
      error_message: error?.message,
    });
    return redirectWithClearedCookies(request, "/login", "exchange_failed");
  }

  await captureServerEvent(data.user.id, "oauth_succeeded", {
    user_id: data.user.id,
    email: data.user.email,
  });

  response.cookies.delete("insforge_code_verifier");
  response.cookies.delete(POST_AUTH_COOKIE);
  return response;
}
