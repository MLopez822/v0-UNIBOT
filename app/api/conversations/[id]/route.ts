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

    // Verify conversation belongs to user
    const { data: conversation } = await supabase.from("conversations").select("*").eq("id", id).single()

    if (!conversation || conversation.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title } = await req.json()

    const { data: updatedConversation, error } = await supabase
      .from("conversations")
      .update({ title })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation: updatedConversation })
  } catch (error) {
    console.error("[v0] Error updating conversation:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
