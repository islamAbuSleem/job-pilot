import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";

const ACCESS_TOKEN_COOKIE = "insforge_access_token";
const REFRESH_TOKEN_COOKIE = "insforge_refresh_token";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), {
    status: 303,
  });

  try {
    const auth = createAuthActions({
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });
    await auth.signOut();
  } catch (error) {
    console.error("[auth/logout] sign-out failed", error);
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }

  return response;
}
