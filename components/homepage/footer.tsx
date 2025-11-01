import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Image
              src="/images/logo-universidad.png"
              alt="Universidad de Medellín"
              width={180}
              height={50}
              className="mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-300">Ciencia y Libertad</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">La Universidad</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-white">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Historia
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Misión y Visión
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Directivas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Oferta Académica</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-white">
                  Pregrados
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Posgrados
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Educación Continua
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Calendario Académico
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Carrera 87 No. 30-65</li>
              <li>Medellín, Colombia</li>
              <li>Tel: (604) 340 5555</li>
              <li>info@udemedellin.edu.co</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2025 Universidad de Medellín. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Youtube className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
