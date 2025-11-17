"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  created_at: string
  is_escalated: boolean
}

interface ChatSidebarProps {
  currentConversationId?: string
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  refreshTrigger?: number
}

export function ChatSidebar({ currentConversationId, onSelectConversation, onNewConversation, refreshTrigger }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [currentConversationId, refreshTrigger])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    }
  }

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-3 mb-4">
          <Image src="/images/logo-unibot.png" alt="UniBot" width={40} height={40} />
          <span className="text-xl font-bold text-[#1e3a5f]">UniBot IA</span>
        </Link>
        <Button onClick={onNewConversation} className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Conversación
        </Button>
      </div>

      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold text-gray-700">Mis Conversaciones</h2>
        <p className="text-xs text-gray-500">Historial de chats recientes</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay conversaciones</div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left",
                  currentConversationId === conversation.id && "bg-blue-50 hover:bg-blue-100",
                )}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title || "Nueva conversación"}
                    </p>
                    {conversation.is_escalated && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Escalado</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(conversation.created_at)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
