import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Microscope, Scale, Cog, GraduationCap } from "lucide-react"

const faculties = [
  {
    icon: BookOpen,
    title: "Facultad de Artes y Humanidades",
    description: "Programas que exploran la creatividad, la cultura y el pensamiento crítico.",
    color: "text-pink-600",
  },
  {
    icon: TrendingUp,
    title: "Facultad de Ciencias Económicas y Administrativas",
    description: "Formación en gestión empresarial, finanzas, mercadeo y desarrollo económico.",
    color: "text-blue-600",
  },
  {
    icon: Microscope,
    title: "Facultad de Ciencias Básicas y Ambientales",
    description: "Investigación y desarrollo en ciencias naturales, matemáticas y sostenibilidad ambiental.",
    color: "text-green-600",
  },
  {
    icon: Scale,
    title: "Facultad de Derecho",
    description: "Estudio de las leyes, justicia, gestión y consolidación de conflictos.",
    color: "text-amber-600",
  },
  {
    icon: Cog,
    title: "Facultad de Ingenierías",
    description: "Innovación en ingeniería, tecnología y desarrollo de soluciones.",
    color: "text-purple-600",
  },
  {
    icon: GraduationCap,
    title: "Posgrados",
    description: "Programas de especialización, maestrías y doctorados para el desarrollo profesional.",
    color: "text-red-600",
  },
]

export function FacultiesSection() {
  return (
    <section id="facultades" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-4">NUESTRAS FACULTADES</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explora nuestras facultades y encuentra el programa académico ideal para tu futuro profesional
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.map((faculty, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 ${faculty.color}`}
                >
                  <faculty.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg text-[#1e3a5f]">{faculty.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{faculty.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
