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

    // Verify admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const satisfactionLevel = searchParams.get("satisfactionLevel")

    // Get total conversations
    let conversationsQuery = supabase.from("conversations").select("*", { count: "exact", head: false })

    if (startDate) {
      conversationsQuery = conversationsQuery.gte("created_at", startDate)
    }
    if (endDate) {
      conversationsQuery = conversationsQuery.lte("created_at", endDate)
    }
    if (satisfactionLevel && satisfactionLevel !== "all") {
      const rating = Number.parseInt(satisfactionLevel)
      conversationsQuery = conversationsQuery.eq("satisfaction_rating", rating)
    }

    const { data: conversations, count: totalConversations } = await conversationsQuery

    // Calculate average satisfaction
    const conversationsWithRating = conversations?.filter((c) => c.satisfaction_rating) || []
    const avgSatisfaction =
      conversationsWithRating.length > 0
        ? conversationsWithRating.reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) /
          conversationsWithRating.length
        : 0

    // Get active users count
    const { count: activeUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")

    // Get escalated cases count
    const { count: escalatedCases } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("is_escalated", true)

    return NextResponse.json({
      totalConversations: totalConversations || 0,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      activeUsers: activeUsers || 0,
      escalatedCases: escalatedCases || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
