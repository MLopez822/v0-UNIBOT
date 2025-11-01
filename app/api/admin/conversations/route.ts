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

    // Get conversations with user profiles
    let query = supabase
      .from("conversations")
      .select(
        `
        *,
        profiles!conversations_user_id_fkey (
          full_name,
          email,
          student_id
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }
    if (satisfactionLevel && satisfactionLevel !== "all") {
      const rating = Number.parseInt(satisfactionLevel)
      query = query.eq("satisfaction_rating", rating)
    }

    const { data: conversations, error } = await query

    if (error) throw error

    return NextResponse.json({ conversations: conversations || [] })
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
