import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle username routes by rewriting to the profile route group
  // Only for single-segment paths that aren't reserved routes
  const pathSegments = pathname.split("/").filter(Boolean)

  if (pathSegments.length === 1) {
    const username = pathSegments[0]

    // List of reserved routes that should NOT be treated as usernames
    const reservedRoutes = [
      "auth",
      "dashboard",
      "api",
      "_next",
      "favicon.ico",
      "robots.txt",
      "sitemap.xml",
      "admin",
      "login",
      "signup",
      "settings",
      "help",
      "about",
      "contact",
      "privacy",
      "terms",
    ]

    // If it's not a reserved route, rewrite to the profile route group
    if (!reservedRoutes.includes(username.toLowerCase())) {
      const url = request.nextUrl.clone()
      url.pathname = `/(profile)/${username}`
      return NextResponse.rewrite(url)
    }
  }

  // For all other routes, just update the session
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
