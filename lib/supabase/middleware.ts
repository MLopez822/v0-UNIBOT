import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect chat, admin, and support routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/chat") ||
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/support"))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (user) {
    console.log("[v0] Middleware - Checking access for user:", user.email, "to path:", request.nextUrl.pathname)

    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (error) {
      console.error("[v0] Middleware - Error fetching profile:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })

      if (error.code === "PGRST116") {
        console.error("[v0] Middleware - Profile not found for user:", user.id)
        console.error("[v0] Middleware - Please run SQL scripts to create user profiles")
      }
    }

    console.log("[v0] Middleware - User profile found:", profile ? `role=${profile.role}` : "NO PROFILE")

    // Admin routes - only for admin role
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!profile) {
        console.log("[v0] Middleware - No profile found for admin route, redirecting to chat")
        const url = request.nextUrl.clone()
        url.pathname = "/chat"
        return NextResponse.redirect(url)
      }

      if (profile.role !== "admin") {
        console.log("[v0] Middleware - User role is", profile.role, "not admin, redirecting to chat")
        const url = request.nextUrl.clone()
        url.pathname = "/chat"
        return NextResponse.redirect(url)
      }

      console.log("[v0] Middleware - Admin access granted")
    }

    // Support routes - only for support and admin roles
    if (request.nextUrl.pathname.startsWith("/support")) {
      if (!profile) {
        console.log("[v0] Middleware - No profile found for support route, redirecting to chat")
        const url = request.nextUrl.clone()
        url.pathname = "/chat"
        return NextResponse.redirect(url)
      }

      if (profile.role !== "support" && profile.role !== "admin") {
        console.log("[v0] Middleware - User role is", profile.role, "not support or admin, redirecting to chat")
        const url = request.nextUrl.clone()
        url.pathname = "/chat"
        return NextResponse.redirect(url)
      }

      console.log("[v0] Middleware - Support access granted")
    }
  }

  return supabaseResponse
}
