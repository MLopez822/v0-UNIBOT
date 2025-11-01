"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { StatsCards } from "@/components/admin/stats-cards"
import { FiltersSection } from "@/components/admin/filters-section"
import { ConversationsTable } from "@/components/admin/conversations-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Download, LogOut, MessageSquare } from "lucide-react"
import { signOut } from "@/lib/auth-actions"

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalConversations: 0,
    avgSatisfaction: "0.0",
    activeUsers: 0,
    escalatedCases: 0,
  })
  const [conversations, setConversations] = useState([])
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    satisfactionLevel: "all",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)
      if (filters.satisfactionLevel !== "all") queryParams.append("satisfactionLevel", filters.satisfactionLevel)

      const [statsRes, conversationsRes] = await Promise.all([
        fetch(`/api/admin/stats?${queryParams}`),
        fetch(`/api/admin/conversations?${queryParams}`),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json()
        setConversations(conversationsData.conversations)
      }
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)

      const response = await fetch(`/api/admin/export?${queryParams}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `conversaciones-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[v0] Error exporting data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo-unibot.png" alt="UniBot" width={40} height={40} />
              <span className="text-xl font-bold text-[#2563eb]">UniBot IA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Link href="/chat">
                <Button variant="ghost" className="text-gray-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
              <Button variant="ghost" className="text-[#2563eb] bg-blue-50">
                Métricas
              </Button>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-[#1e3a5f] text-white">A</AvatarFallback>
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona conversaciones, usuarios y datos del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FiltersSection filters={filters} onFilterChange={setFilters} onApplyFilters={fetchData} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/admin/users")} variant="outline" className="border-[#1e3a5f]">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Button>
            <Button onClick={handleExport} variant="outline" className="border-[#1e3a5f] bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>

        {/* Conversations Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <ConversationsTable conversations={conversations} />
        )}
      </main>
    </div>
  )
}
