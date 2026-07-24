import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup";
  const token = request.cookies.get("token")?.value || "";

  // logged in user trying to visit login/signup -> send to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // no token, trying to visit protected page -> send to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  }

  export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard", "/admin/properties"],
};