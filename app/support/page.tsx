"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CaseStats } from "@/components/support/case-stats"
import { CaseFilters } from "@/components/support/case-filters"
import { CasesTable } from "@/components/support/cases-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, MessageSquare, RefreshCw } from "lucide-react"
import { signOut } from "@/lib/auth-actions"

export default function SupportPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    inProgressCases: 0,
    closedCases: 0,
    pendingCases: 0,
  })
  const [cases, setCases] = useState([])
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    startDate: "",
    endDate: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.status !== "all") queryParams.append("status", filters.status)
      if (filters.priority !== "all") queryParams.append("priority", filters.priority)
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)

      const [statsRes, casesRes] = await Promise.all([
        fetch(`/api/support/stats?${queryParams}`),
        fetch(`/api/support/cases?${queryParams}`),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (casesRes.ok) {
        const casesData = await casesRes.json()
        setCases(casesData.cases)
      }
    } catch (error) {
      console.error("[v0] Error fetching support data:", error)
    } finally {
      setIsLoading(false)
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
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={fetchData} variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-[#1e3a5f] text-white">S</AvatarFallback>
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Dashboard - Soporte Técnico</h1>
          <p className="text-gray-600">¡Hola, Ana María! Gestiona tus casos de soporte.</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <CaseStats stats={stats} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CaseFilters filters={filters} onFilterChange={setFilters} onApplyFilters={fetchData} />
        </div>

        {/* Cases Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <p className="text-gray-500">Cargando casos...</p>
          </div>
        ) : (
          <CasesTable cases={cases} onCaseUpdated={fetchData} />
        )}
      </main>
    </div>
  )
}
