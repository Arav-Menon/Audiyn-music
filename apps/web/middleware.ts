import { NextResponse } from "next/server";

export function middleware(request: any) {
  const token = request.cookies.get("token")?.value;

  const url = request.nextUrl.pathname;

  // Protect dashboard
  if (url.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
