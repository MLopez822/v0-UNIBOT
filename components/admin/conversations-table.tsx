"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Conversation {
  id: string
  created_at: string
  satisfaction_rating: number | null
  is_escalated: boolean
  profiles: {
    full_name: string
    email: string
    student_id: string | null
  }
}

interface ConversationsTableProps {
  conversations: Conversation[]
}

export function ConversationsTable({ conversations }: ConversationsTableProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const renderSatisfaction = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">Sin calificar</span>

    return (
      <div className="flex items-center gap-1">
        <span className="font-semibold">{rating}</span>
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-[#1e3a5f]">Historial de Conversaciones</h3>
        <p className="text-sm text-gray-500">Mostrando resultados</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Satisfacción</TableHead>
              <TableHead>Escalado</TableHead>
              <TableHead>Resuelto</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No hay conversaciones para mostrar
                </TableCell>
              </TableRow>
            ) : (
              conversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{conversation.profiles?.full_name || "Usuario"}</p>
                      <p className="text-sm text-gray-500">{conversation.profiles?.email || "N/A"}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(conversation.created_at)}</TableCell>
                  <TableCell>{renderSatisfaction(conversation.satisfaction_rating)}</TableCell>
                  <TableCell>
                    {conversation.is_escalated ? (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">Sí</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {conversation.is_escalated ? (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pendiente</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Resuelto</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedConversation(conversation)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalles de la Conversación</DialogTitle>
                          <DialogDescription>Información completa del usuario y la conversación</DialogDescription>
                        </DialogHeader>
                        {selectedConversation && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Usuario</p>
                              <p className="text-base">{selectedConversation.profiles?.full_name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p className="text-base">{selectedConversation.profiles?.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">ID Estudiante</p>
                              <p className="text-base">{selectedConversation.profiles?.student_id || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Fecha</p>
                              <p className="text-base">{formatDate(selectedConversation.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Satisfacción</p>
                              <p className="text-base">
                                {selectedConversation.satisfaction_rating
                                  ? `${selectedConversation.satisfaction_rating}/5`
                                  : "Sin calificar"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Estado</p>
                              <p className="text-base">
                                {selectedConversation.is_escalated ? "Escalado a soporte" : "Resuelto por IA"}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
