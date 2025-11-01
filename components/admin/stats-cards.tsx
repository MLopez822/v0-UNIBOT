import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, Users, AlertCircle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalConversations: number
    avgSatisfaction: string
    activeUsers: number
    escalatedCases: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Conversaciones</CardTitle>
          <MessageSquare className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats.totalConversations.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Visión general de la carga</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Satisfacción Promedio</CardTitle>
          <Star className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{stats.avgSatisfaction}/5</div>
          <p className="text-xs text-gray-500 mt-1">Calidad del servicio</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Usuarios Activos</CardTitle>
          <Users className="h-4 w-4 text-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-700">{stats.activeUsers.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Estudiantes registrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Casos Escalados</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{stats.escalatedCases}</div>
          <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
        </CardContent>
      </Card>
    </div>
  )
}
