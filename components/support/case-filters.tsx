"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CaseFiltersProps {
  filters: {
    status: string
    priority: string
    startDate: string
    endDate: string
  }
  onFilterChange: (filters: any) => void
  onApplyFilters: () => void
}

export function CaseFilters({ filters, onFilterChange, onApplyFilters }: CaseFiltersProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={filters.status} onValueChange={(value) => onFilterChange({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abierto</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="closed">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select value={filters.priority} onValueChange={(value) => onFilterChange({ ...filters, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha Inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha Fin</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={onApplyFilters} className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
