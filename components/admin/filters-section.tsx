"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersSectionProps {
  filters: {
    startDate: string
    endDate: string
    satisfactionLevel: string
  }
  onFilterChange: (filters: any) => void
  onApplyFilters: () => void
}

export function FiltersSection({ filters, onFilterChange, onApplyFilters }: FiltersSectionProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="satisfaction">Nivel de Satisfacción</Label>
          <Select
            value={filters.satisfactionLevel}
            onValueChange={(value) => onFilterChange({ ...filters, satisfactionLevel: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="5">5 - Excelente</SelectItem>
              <SelectItem value="4">4 - Muy bueno</SelectItem>
              <SelectItem value="3">3 - Bueno</SelectItem>
              <SelectItem value="2">2 - Regular</SelectItem>
              <SelectItem value="1">1 - Malo</SelectItem>
            </SelectContent>
          </Select>
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
