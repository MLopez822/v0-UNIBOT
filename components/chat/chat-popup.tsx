"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { X, Maximize2, Send, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "¡Hola! Soy UniBot. ¿En qué puedo ayudarte hoy?" },
  ])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    if (!isAuthenticated) {
      alert("Por favor inicia sesión para usar el chatbot")
      return
    }

    const userMessage = message
    setMessage("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error en la respuesta del servidor")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        const lines = chunk
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("data: "))

        for (const line of lines) {
          const json = line.replace(/^data:\s*/, "")
          if (json === "[DONE]") continue

          try {
            const parsed = JSON.parse(json)
            const delta = parsed?.delta?.content || ""
            assistantMessage += delta

            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: assistantMessage,
              }
              return newMessages
            })
          } catch {
          }
        }
      }
    } catch (error: any) {
      console.error("[UniBot] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Lo siento, hubo un error: ${error.message}. Por favor verifica que el backend esté configurado correctamente.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExpand = () => {
    if (!isAuthenticated) {
      alert("Por favor inicia sesión para acceder al chat completo")
      return
    }
    router.push("/chat")
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        style={{ backgroundColor: "#C8102E" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A00D25")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C8102E")}
      >
        <MessageCircle className="h-8 w-8 text-white" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div
        className="text-white p-4 rounded-t-lg flex items-center justify-between"
        style={{ backgroundColor: "#C8102E" }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-unibot.png"
            alt="UniBot"
            width={40}
            height={40}
            className="rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-bold text-lg">UniBot</h3>
            <p className="text-xs text-white/90">Asistente Virtual</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleExpand} className="text-white hover:bg-white/20">
            <Maximize2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user" ? "text-white" : "bg-white text-gray-800 border border-gray-200"
              }`}
              style={msg.role === "user" ? { backgroundColor: "#1e3a5f" } : {}}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        {!isAuthenticated && (
          <p className="text-xs text-center text-gray-600 mb-2">Inicia sesión para usar el chatbot</p>
        )}
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Escribe tu mensaje..."
            className="resize-none"
            rows={2}
            disabled={!isAuthenticated || isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || !isAuthenticated || isLoading}
            style={{ backgroundColor: "#1e3a5f" }}
            className="hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          UniBot IA está aquí para ayudarte. Las respuestas son generadas por IA y pueden requerir verificación.
        </p>
      </div>
    </Card>
  )
}

export default ChatPopup