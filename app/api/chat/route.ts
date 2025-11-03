import { createClient } from "@/lib/supabase/server"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages, conversationId } = await req.json()

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Error fetching profile:", profileError)
      return new Response(
        JSON.stringify({
          error:
            "Error al obtener perfil de usuario. Por favor, asegúrate de que las tablas de la base de datos estén creadas ejecutando los scripts SQL.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    const { data: faqs, error: faqsError } = await supabase.from("faqs").select("*").eq("is_active", true).limit(20)

    if (faqsError) {
      console.error("[v0] Error fetching FAQs:", faqsError)
      // Continue without FAQs if table doesn't exist
    }

    // Build context from FAQs
    const faqContext =
      faqs?.map((faq) => `Pregunta: ${faq.question}\nRespuesta: ${faq.answer}`).join("\n\n") ||
      "No hay FAQs disponibles."

    const systemPrompt = `Eres UniBot, el asistente virtual oficial de la Universidad de Medellín. Tu objetivo es ayudar a estudiantes, profesores y personal administrativo con información sobre la universidad.

Información del usuario:
- Nombre: ${profile?.full_name || "Usuario"}
- Rol: ${profile?.role || "estudiante"}
- ID Estudiante: ${profile?.student_id || "N/A"}

Base de conocimiento (FAQs):
${faqContext}

Instrucciones:
1. Sé amable, profesional y servicial
2. Responde en español de forma clara y concisa
3. Si la pregunta está en las FAQs, usa esa información
4. Si no tienes información específica, sugiere contactar a la oficina correspondiente
5. Puedes sugerir al usuario escalar su consulta a soporte si es necesario
6. Mantén un tono académico pero cercano
7. Si el usuario pregunta sobre temas fuera del ámbito universitario, redirige amablemente al tema de la universidad

Recuerda: Eres el asistente oficial de la Universidad de Medellín y tu propósito es facilitar la experiencia universitaria.`

    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save messages to database
    if (conversationId) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: lastMessage.role,
          content: lastMessage.content,
        })
      }
    }

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
