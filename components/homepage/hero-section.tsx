"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignupModal } from "@/components/auth/signup-modal"

export function HeroSection() {
  const [signupOpen, setSignupOpen] = useState(false)

  return (
    <>
      <section className="relative h-[500px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/universidad-campus-edificio-academico.jpg')",
            filter: "brightness(0.6)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/80 to-[#1e3a5f]/40" />

        <div className="relative container mx-auto h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">Construyendo Futuro</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl text-balance">
            La Universidad de Medellín, comprometida con la excelencia académica y el desarrollo integral de sus
            estudiantes, te invita a ser parte de su legado.
          </p>
          <Button
            size="lg"
            onClick={() => setSignupOpen(true)}
            className="bg-[#C8102E] hover:bg-[#A00D25] text-white text-lg px-8 py-6 h-auto"
          >
            ¡Inscríbete Ahora!
          </Button>
        </div>
      </section>

      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </>
  )
}
