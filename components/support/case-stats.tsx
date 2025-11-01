import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface CaseStatsProps {
  stats: {
    totalCases: number
    openCases: number
    inProgressCases: number
    closedCases: number
    pendingCases: number
  }
}

export function CaseStats({ stats }: CaseStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Casos Totales</CardTitle>
          <FileText className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{stats.totalCases}</div>
          <p className="text-xs text-gray-500 mt-1">Visión general de la carga</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Casos Abiertos</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{stats.openCases}</div>
          <p className="text-xs text-gray-500 mt-1">En espera de atención</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Casos Completados</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{stats.closedCases}</div>
          <p className="text-xs text-gray-500 mt-1">Completados satisfactoriamente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Casos Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">{stats.pendingCases}</div>
          <p className="text-xs text-gray-500 mt-1">Esperando respuesta externa</p>
        </CardContent>
      </Card>
    </div>
  )
}
