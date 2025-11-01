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

    // Build query
    let query = supabase.from("support_cases").select("*", { count: "exact", head: false })

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

    const { data: cases, count: totalCases } = await query

    // Calculate stats
    const openCases = cases?.filter((c) => c.status === "open").length || 0
    const inProgressCases = cases?.filter((c) => c.status === "in_progress").length || 0
    const closedCases = cases?.filter((c) => c.status === "closed").length || 0
    const pendingCases = cases?.filter((c) => c.status === "pending").length || 0

    return NextResponse.json({
      totalCases: totalCases || 0,
      openCases,
      inProgressCases,
      closedCases,
      pendingCases,
    })
  } catch (error) {
    console.error("[v0] Error fetching support stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
