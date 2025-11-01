import { Header } from "@/components/homepage/header"
import { HeroSection } from "@/components/homepage/hero-section"
import { FacultiesSection } from "@/components/homepage/faculties-section"
import { NewsSection } from "@/components/homepage/news-section"
import { Footer } from "@/components/homepage/footer"
import { ChatPopup } from "@/components/chat/chat-popup"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FacultiesSection />
        <NewsSection />
      </main>
      <Footer />
      <ChatPopup />
    </div>
  )
}
