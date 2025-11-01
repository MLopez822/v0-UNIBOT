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

    // Get conversations with user data
    let query = supabase
      .from("conversations")
      .select(
        `
        *,
        profiles!conversations_user_id_fkey (
          full_name,
          email
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

    const { data: conversations, error } = await query

    if (error) throw error

    // Convert to CSV
    const csvHeaders = "Usuario,Email,Fecha,Satisfacción,Escalado,Resuelto\n"
    const csvRows =
      conversations
        ?.map((conv: any) => {
          const userName = conv.profiles?.full_name || "N/A"
          const userEmail = conv.profiles?.email || "N/A"
          const date = new Date(conv.created_at).toLocaleDateString("es-ES")
          const satisfaction = conv.satisfaction_rating || "N/A"
          const escalated = conv.is_escalated ? "Sí" : "No"
          const resolved = conv.is_escalated ? "Pendiente" : "Resuelto"

          return `"${userName}","${userEmail}","${date}","${satisfaction}","${escalated}","${resolved}"`
        })
        .join("\n") || ""

    const csv = csvHeaders + csvRows

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="conversaciones-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
