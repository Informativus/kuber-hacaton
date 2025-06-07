import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/auth"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log(request.cookies.get("token"));
  console.log(request.cookies);

  const { pathname } = request.nextUrl;

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  if (!token && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/auth") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
