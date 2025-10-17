import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Admin routes - use existing cookie-based auth
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true"

    if (!isLoggedIn) {
      // Redirect to the existing admin login page
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on admin routes only
// Auth.js will handle its own middleware for public user sessions
export const config = {
  matcher: [
    "/admin/:path*",
  ],
}
