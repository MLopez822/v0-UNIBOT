import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, description, priority } = await req.json()

    // Verify conversation belongs to user
    const { data: conversation } = await supabase.from("conversations").select("*").eq("id", id).single()

    if (!conversation || conversation.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Generate case number
    const caseNumber = `UDEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create support case
    const { data: supportCase, error: caseError } = await supabase
      .from("support_cases")
      .insert({
        case_number: caseNumber,
        conversation_id: id,
        user_id: user.id,
        subject,
        description,
        priority: priority || "medium",
        status: "open",
      })
      .select()
      .single()

    if (caseError) throw caseError

    // Update conversation as escalated
    await supabase
      .from("conversations")
      .update({
        is_escalated: true,
        escalated_at: new Date().toISOString(),
      })
      .eq("id", id)

    return NextResponse.json({ supportCase })
  } catch (error) {
    console.error("[v0] Error escalating conversation:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
