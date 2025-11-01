import { createClient } from "@supabase/supabase-js"

// Este script crea los usuarios de prueba usando Supabase Auth
// Ejecutar con: node --loader ts-node/esm scripts/setup-users.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const testUsers = [
  {
    email: "estudiante@udemedellin.edu.co",
    password: "estudiante123",
    full_name: "María González",
    role: "student",
  },
  {
    email: "soporte@udemedellin.edu.co",
    password: "soporte123",
    full_name: "Ana María Torres",
    role: "support",
  },
  {
    email: "admin@udemedellin.edu.co",
    password: "admin123",
    full_name: "Carlos Rodríguez",
    role: "admin",
  },
]

async function setupUsers() {
  console.log("🚀 Creando usuarios de prueba...\n")

  for (const userData of testUsers) {
    try {
      // Crear usuario con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          full_name: userData.full_name,
        },
      })

      if (authError) {
        console.error(`❌ Error creando ${userData.email}:`, authError.message)
        continue
      }

      // Actualizar el perfil con el rol correcto
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: userData.role,
          full_name: userData.full_name,
        })
        .eq("id", authData.user.id)

      if (profileError) {
        console.error(`❌ Error actualizando perfil de ${userData.email}:`, profileError.message)
        continue
      }

      console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`)
    } catch (error) {
      console.error(`❌ Error inesperado con ${userData.email}:`, error)
    }
  }

  console.log("\n✨ Proceso completado!")
}

setupUsers()
