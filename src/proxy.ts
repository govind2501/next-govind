import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only these pages actually require the user to be logged in
  const isProtectedPath =
    path === "/dashboard" ||
    path === "/property/add" ||
    path.startsWith("/admin");

  const isAuthPath = path === "/login" || path === "/signup";
  const token = request.cookies.get("token")?.value || "";

  // Logged in user trying to visit login/signup -> send to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // No token, trying to visit a protected page -> send to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard",
    "/property",
    "/property/add",
    "/about",
    "/contact",
    "/admin/properties",
    "/admin/subscriptions",
    "/admin/analytics",
    "/api/users/me",
    "/api/users/logout",
    "/api/tracking/start",
    "/api/tracking/heartbeat",
  ],
};