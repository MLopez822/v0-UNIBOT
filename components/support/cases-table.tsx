"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SupportCase {
  id: string
  case_number: string
  subject: string
  description: string
  status: string
  priority: string
  created_at: string
  resolution: string | null
  profiles: {
    full_name: string
    email: string
    student_id: string | null
  }
  assigned_profile: {
    full_name: string
  } | null
}

interface CasesTableProps {
  cases: SupportCase[]
  onCaseUpdated: () => void
}

export function CasesTable({ cases, onCaseUpdated }: CasesTableProps) {
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: "",
    priority: "",
    resolution: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Abierto", className: "bg-red-100 text-red-700" },
      in_progress: { label: "En Progreso", className: "bg-yellow-100 text-yellow-700" },
      pending: { label: "Pendiente", className: "bg-orange-100 text-orange-700" },
      closed: { label: "Cerrado", className: "bg-green-100 text-green-700" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open

    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: "Alta", className: "bg-red-100 text-red-700" },
      medium: { label: "Media", className: "bg-yellow-100 text-yellow-700" },
      low: { label: "Baja", className: "bg-blue-100 text-blue-700" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleOpenDialog = (supportCase: SupportCase) => {
    setSelectedCase(supportCase)
    setUpdateData({
      status: supportCase.status,
      priority: supportCase.priority,
      resolution: supportCase.resolution || "",
    })
    setDialogOpen(true)
  }

  const handleUpdateCase = async () => {
    if (!selectedCase) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/support/cases/${selectedCase.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setDialogOpen(false)
        onCaseUpdated()
      }
    } catch (error) {
      console.error("[v0] Error updating case:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-[#1e3a5f]">Gestión de Casos</h3>
          <p className="text-sm text-gray-500">Casos de soporte escalados</p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Caso</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Asignado A</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No hay casos para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((supportCase) => (
                  <TableRow key={supportCase.id}>
                    <TableCell className="font-mono text-sm">{supportCase.case_number}</TableCell>
                    <TableCell className="max-w-xs truncate">{supportCase.subject}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{supportCase.profiles?.full_name || "Usuario"}</p>
                        <p className="text-sm text-gray-500">{supportCase.profiles?.email || "N/A"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(supportCase.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(supportCase.status)}</TableCell>
                    <TableCell>{getPriorityBadge(supportCase.priority)}</TableCell>
                    <TableCell>{supportCase.assigned_profile?.full_name || "Sin asignar"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(supportCase)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Caso</DialogTitle>
            <DialogDescription>Gestiona y actualiza el estado del caso de soporte</DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID de Caso</p>
                  <p className="text-base font-mono">{selectedCase.case_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                  <p className="text-base">{formatDate(selectedCase.created_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Usuario</p>
                <p className="text-base">{selectedCase.profiles?.full_name}</p>
                <p className="text-sm text-gray-500">{selectedCase.profiles?.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Asunto</p>
                <p className="text-base">{selectedCase.subject}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-base whitespace-pre-wrap">{selectedCase.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={updateData.status}
                    onValueChange={(value) => setUpdateData({ ...updateData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Abierto</SelectItem>
                      <SelectItem value="in_progress">En Progreso</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={updateData.priority}
                    onValueChange={(value) => setUpdateData({ ...updateData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolution">Resolución</Label>
                <Textarea
                  id="resolution"
                  value={updateData.resolution}
                  onChange={(e) => setUpdateData({ ...updateData, resolution: e.target.value })}
                  placeholder="Describe cómo se resolvió el caso..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCase} disabled={isUpdating} className="bg-[#C8102E] hover:bg-[#A00D25]">
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar Caso"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
