import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Check if the user is trying to access a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/protected");

  // If no token and trying to access protected routes, redirect to Sign In
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/protected/:path*"], // Protect all routes under `/protected/`
};
