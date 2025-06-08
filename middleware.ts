import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Get the auth cookie
    const authCookie = request.cookies.get("auth-token")

    // If no auth cookie or it's invalid, redirect to login
    if (!authCookie || authCookie.value !== "authenticated") {
      const loginUrl = new URL("/login", request.url)
      // Add a redirect parameter to return to the admin page after login
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on /admin routes
export const config = {
  matcher: "/admin/:path*",
}
