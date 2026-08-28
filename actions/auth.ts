"use server";

import { cookies } from "next/headers";
import { createAuthActions } from "@insforge/sdk/ssr";
import { POST_AUTH_COOKIE, sanitizeNextPath } from "@/lib/auth-redirect";

type OAuthProvider = "google" | "github";

type InitiateOAuthResult =
  | { success: true; url: string }
  | { success: false; error: string };

const POST_AUTH_MAX_AGE = 600;

export async function initiateOAuth(
  provider: OAuthProvider,
  nextPath?: string,
): Promise<InitiateOAuthResult> {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const redirectTo = new URL(
    "/api/auth/callback",
    process.env.NEXT_PUBLIC_APP_URL,
  ).toString();

  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data?.codeVerifier) {
    console.error(
      "[actions/auth] initiateOAuth failed",
      `provider=${provider}`,
      error?.message ?? "missing data",
    );
    return { success: false, error: error?.message ?? "OAuth init failed" };
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: POST_AUTH_MAX_AGE,
  });

  const safeNext = sanitizeNextPath(nextPath);
  if (safeNext) {
    cookieStore.set(POST_AUTH_COOKIE, safeNext, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: POST_AUTH_MAX_AGE,
    });
  } else {
    cookieStore.delete(POST_AUTH_COOKIE);
  }

  return { success: true, url: data.url };
}

export async function signOut() {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });
  return auth.signOut();
}
