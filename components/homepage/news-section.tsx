import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

const news = [
  {
    title: "La UdeM se consolida como institución líder en investigación",
    description: "Reconocimiento nacional por proyectos de innovación y desarrollo científico.",
    date: "15 de Enero, 2025",
    category: "Académico",
    image: "/universidad-investigacion-laboratorio.jpg",
  },
  {
    title: "Nueva alianza para promover emprendimiento universitario",
    description: "Convenio con empresas líderes para impulsar proyectos de estudiantes.",
    date: "12 de Enero, 2025",
    category: "Convenios",
    image: "/estudiantes-emprendimiento-reunion.jpg",
  },
  {
    title: "Feria de emprendimiento: más de 50 proyectos presentados",
    description: "Estudiantes muestran sus ideas innovadoras ante inversionistas y empresarios.",
    date: "10 de Enero, 2025",
    category: "Eventos",
    image: "/feria-universitaria-proyectos.jpg",
  },
  {
    title: "Becas y apoyo económico: nuevas oportunidades",
    description: "La universidad amplía su programa de becas para estudiantes destacados.",
    date: "8 de Enero, 2025",
    category: "Becas",
    image: "/estudiantes-graduacion-celebracion.jpg",
  },
]

export function NewsSection() {
  return (
    <section id="noticias" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">NOTICIAS UDEMEDELLIN</h2>
          <button className="text-[#C8102E] hover:underline font-medium">Ver todas las noticias →</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }} />
              <CardHeader>
                <Badge className="w-fit mb-2 bg-yellow-400 text-black hover:bg-yellow-500">{item.category}</Badge>
                <CardTitle className="text-base text-[#1e3a5f] line-clamp-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
