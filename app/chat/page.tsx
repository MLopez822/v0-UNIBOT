"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { EscalateDialog } from "@/components/chat/escalate-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, AlertCircle, Star, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-actions"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  full_name: string
  email: string
  role: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [escalateOpen, setEscalateOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      await fetchProfile()
      await createNewConversation()
    }

    checkAuthAndLoad()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    }
  }

  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nueva conversación" }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentConversationId(data.conversation.id)
        setMessages([])
      }
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setCurrentConversationId(conversationId)
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("[v0] Error loading conversation:", error)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          conversationId: currentConversationId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error en la respuesta")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      let buffer = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            
            if (data === "[DONE]") {
              break
            }

            try {
              const parsed = JSON.parse(data)
              
              if (parsed.type === "text-delta" && parsed.delta) {
                assistantContent += parsed.delta
                
                setMessages((prev) => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    ...assistantMessage,
                    content: assistantContent,
                  }
                  return newMessages
                })
              }
            } catch (e) {
              console.warn("[v0] Failed to parse SSE data:", data)
            }
          }
        }
      }

      if (currentConversationId) {
        await fetch(`/api/conversations/${currentConversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "assistant",
            content: assistantContent,
          }),
        })
      }
    } catch (error: any) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Lo siento, hubo un error: ${error.message}. Por favor verifica que las tablas de la base de datos estén creadas correctamente.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEscalated = () => {
    alert("Tu caso ha sido escalado exitosamente. El equipo de soporte se pondrá en contacto contigo pronto.")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        currentConversationId={currentConversationId || undefined}
        onSelectConversation={loadConversation}
        onNewConversation={createNewConversation}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1e3a5f]">Hola, {profile?.full_name || "Usuario"}</h1>
            <p className="text-sm text-gray-500">¿En qué puedo ayudarte hoy?</p>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEscalateOpen(true)}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Escalar a Soporte
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="w-4 h-4 mr-2" />
                  Calificar Conversación
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-[#1e3a5f] text-white">
                      {profile?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">¡Bienvenido a UniBot!</h2>
              <p className="text-gray-500">Pregúntame cualquier cosa sobre la Universidad de Medellín</p>
            </div>
          </div>
        ) : (
          <ChatMessages messages={messages} />
        )}

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      {currentConversationId && (
        <EscalateDialog
          open={escalateOpen}
          onOpenChange={setEscalateOpen}
          conversationId={currentConversationId}
          onEscalated={handleEscalated}
        />
      )}
    </div>
  )
}
