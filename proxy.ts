import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/find-jobs"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !request.cookies.get("insforge_access_token")?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)",
  ],
};
