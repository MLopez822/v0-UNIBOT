"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at?: string
}

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTime = (dateString?: string) => {
    if (!dateString) {
      const date = new Date();
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    }

    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
          {message.role === "assistant" && (
            <Avatar className="w-10 h-10 border-2 border-blue-500">
              <AvatarFallback className="bg-blue-500 text-white">
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "max-w-[70%] rounded-2xl px-4 py-3",
              message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900",
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <p className={cn("text-xs mt-2", message.role === "user" ? "text-blue-100" : "text-gray-500")}>
              {formatTime(message.created_at)}
            </p>
          </div>

          {message.role === "user" && (
            <Avatar className="w-10 h-10 border-2 border-gray-300">
              <AvatarFallback className="bg-gray-300 text-gray-700">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  )
}
