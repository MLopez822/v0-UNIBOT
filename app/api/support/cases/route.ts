import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify support or admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "support" && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Get cases with user profiles
    let query = supabase
      .from("support_cases")
      .select(
        `
        *,
        profiles!support_cases_user_id_fkey (
          full_name,
          email,
          student_id
        ),
        assigned_profile:profiles!support_cases_assigned_to_fkey (
          full_name
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }
    if (priority && priority !== "all") {
      query = query.eq("priority", priority)
    }
    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data: cases, error } = await query

    if (error) throw error

    return NextResponse.json({ cases: cases || [] })
  } catch (error) {
    console.error("[v0] Error fetching support cases:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
