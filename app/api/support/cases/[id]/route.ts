import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const body = await req.json()
    const { status, priority, assigned_to, resolution } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to
    if (resolution) updateData.resolution = resolution
    if (status === "closed") updateData.resolved_at = new Date().toISOString()

    const { data: updatedCase, error } = await supabase
      .from("support_cases")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ case: updatedCase })
  } catch (error) {
    console.error("[v0] Error updating support case:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
