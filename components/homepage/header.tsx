"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/auth/login-modal"
import { SignupModal } from "@/components/auth/signup-modal"
import { Menu, X, User, MessageSquare, LayoutDashboard, Headphones, LogOut, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/auth-actions"

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)
          const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          if (!error && profile) {
            setProfile(profile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error("[v0] Error checking user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Subscribe to auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUser()
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setProfile(null)
  }

  const handleNavigation = (path: string) => {
    if (!user) {
      setLoginOpen(true)
    } else {
      router.push(path)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo-universidad.png" alt="Universidad de Medellín" width={180} height={50} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#facultades"
              className="text-sm font-medium text-[#1e3a5f] hover:text-[#C8102E] transition-colors"
            >
              Facultades
            </Link>
            <Link
              href="#noticias"
              className="text-sm font-medium text-[#1e3a5f] hover:text-[#C8102E] transition-colors"
            >
              Noticias
            </Link>
            <Link
              href="#contacto"
              className="text-sm font-medium text-[#1e3a5f] hover:text-[#C8102E] transition-colors"
            >
              Contacto
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-[#C8102E] hover:text-[#C8102E] hover:bg-[#C8102E]/10"
                >
                  Servicios
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleNavigation("/chat")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chatbot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/admin")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Métricas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/support")}>
                  <Headphones className="h-4 w-4 mr-2" />
                  Soporte
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white transition-colors bg-transparent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Usuario
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.full_name || "Usuario"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setLoginOpen(true)}
                  className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => setSignupOpen(true)}
                  style={{ backgroundColor: "#C8102E" }}
                  className="text-white hover:opacity-90 transition-opacity"
                >
                  Inscríbete Ahora
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto flex flex-col gap-4 p-4">
              <Link href="#facultades" className="text-sm font-medium text-[#1e3a5f] hover:text-[#C8102E]">
                Facultades
              </Link>
              <Link href="#noticias" className="text-sm font-medium text-[#1e3a5f] hover:text-[#C8102E]">
                Noticias
              </Link>
              <Link href="#contacto" className="text-sm font-medium text-[#1e3a5f] hover:text-[#C8102E]">
                Contacto
              </Link>

              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-[#C8102E] mb-2">SERVICIOS</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleNavigation("/chat")
                      setMobileMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chatbot
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleNavigation("/admin")
                      setMobileMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Métricas
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleNavigation("/support")
                      setMobileMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Soporte
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t">
                {user ? (
                  <>
                    <div className="px-2 py-1 text-sm text-gray-600">
                      <p className="font-medium">{profile?.full_name || "Usuario"}</p>
                      <p className="text-xs">{user.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="justify-start text-red-600 border-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setLoginOpen(true)
                        setMobileMenuOpen(false)
                      }}
                      className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      onClick={() => {
                        setSignupOpen(true)
                        setMobileMenuOpen(false)
                      }}
                      style={{ backgroundColor: "#C8102E" }}
                      className="text-white hover:opacity-90"
                    >
                      Inscríbete Ahora
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </>
  )
}
