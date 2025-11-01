# 🚀 Guía de Despliegue - UniBot

## Opción 1: Desplegar desde v0 (Recomendado)

### Paso 1: Publicar en Vercel
1. En la interfaz de v0, haz clic en el botón **"Publish"** (arriba a la derecha)
2. Selecciona tu cuenta de Vercel
3. Elige un nombre para tu proyecto (ej: `unibot-udemedellin`)
4. Haz clic en **"Deploy"**
5. Espera a que termine el despliegue (2-3 minutos)

### Paso 2: Verificar Variables de Entorno
Las variables de Supabase ya están configuradas automáticamente desde v0:
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Y todas las variables de conexión a PostgreSQL

### Paso 3: Ejecutar Scripts SQL
1. Ve a la pestaña **"Connect"** en el sidebar de v0
2. Haz clic en **"Supabase"**
3. Ejecuta los scripts en orden:
   - `001_create_tables.sql` - Crea las tablas
   - `002_create_profile_trigger.sql` - Crea el trigger de perfiles
   - `003_seed_faqs.sql` - Inserta las FAQs

### Paso 4: Crear Usuarios de Prueba

**Opción A: Desde Supabase Dashboard**
1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Authentication > Users**
4. Haz clic en **"Add user"** y crea cada uno:

**Usuario Estudiante:**
- Email: `estudiante@udemedellin.edu.co`
- Password: `estudiante123`
- Confirmar email: ✅ Activado

**Usuario Soporte:**
- Email: `soporte@udemedellin.edu.co`
- Password: `soporte123`
- Confirmar email: ✅ Activado

**Usuario Admin:**
- Email: `admin@udemedellin.edu.co`
- Password: `admin123`
- Confirmar email: ✅ Activado

5. Después de crear cada usuario, ve a **Database > Table Editor > profiles**
6. Actualiza el campo `role` de cada usuario:
   - `estudiante@udemedellin.edu.co` → role: `student`
   - `soporte@udemedellin.edu.co` → role: `support`
   - `admin@udemedellin.edu.co` → role: `admin`

**Opción B: Usando el Script (Avanzado)**
Si tienes Node.js instalado localmente:
\`\`\`bash
# Descargar el proyecto
# Instalar dependencias
npm install

# Ejecutar el script de setup
npx tsx scripts/setup-users.ts
\`\`\`

### Paso 5: Probar la Aplicación
1. Abre tu URL de Vercel (ej: `https://unibot-udemedellin.vercel.app`)
2. Haz clic en **"Iniciar Sesión"**
3. Usa las credenciales de prueba
4. ¡Listo! 🎉

---

## Opción 2: Desplegar Manualmente

### Paso 1: Descargar el Código
1. En v0, haz clic en los tres puntos (⋮) arriba a la derecha
2. Selecciona **"Download ZIP"**
3. Extrae el archivo ZIP

### Paso 2: Instalar Dependencias
\`\`\`bash
cd unibot-university-chatbot
npm install
\`\`\`

### Paso 3: Configurar Variables de Entorno
Crea un archivo `.env.local` con las variables de Supabase:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

# Para desarrollo local
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

Obtén estas variables desde:
1. [supabase.com](https://supabase.com)
2. Tu proyecto > Settings > API
3. Copia las URLs y Keys

### Paso 4: Ejecutar Scripts SQL
Ejecuta los scripts en tu base de datos Supabase (en orden):
1. `scripts/001_create_tables.sql`
2. `scripts/002_create_profile_trigger.sql`
3. `scripts/003_seed_faqs.sql`

### Paso 5: Crear Usuarios
Sigue las instrucciones del **Paso 4** de la Opción 1

### Paso 6: Ejecutar Localmente
\`\`\`bash
npm run dev
\`\`\`
Abre [http://localhost:3000](http://localhost:3000)

### Paso 7: Desplegar a Vercel
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Seguir las instrucciones en pantalla
\`\`\`

O desde el dashboard de Vercel:
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno
5. Haz clic en **"Deploy"**

---

## 🔧 Configuración Post-Despliegue

### Configurar URL de Redirección
1. Ve a Supabase Dashboard
2. Authentication > URL Configuration
3. Agrega tu URL de Vercel a **Site URL** y **Redirect URLs**:
   \`\`\`
   https://tu-proyecto.vercel.app
   https://tu-proyecto.vercel.app/**
   \`\`\`

### Verificar RLS (Row Level Security)
1. Ve a Database > Policies
2. Verifica que todas las tablas tengan políticas activas
3. Las políticas ya están creadas en el script SQL

---

## 📱 Acceso a la Aplicación

Una vez desplegada, puedes acceder a:

- **Página Principal:** `https://tu-proyecto.vercel.app/`
- **Chat:** `https://tu-proyecto.vercel.app/chat`
- **Admin Dashboard:** `https://tu-proyecto.vercel.app/admin`
- **Support Dashboard:** `https://tu-proyecto.vercel.app/support`

---

## 🐛 Solución de Problemas

### "Invalid login credentials"
- Verifica que los usuarios estén creados en Supabase Auth
- Confirma que los emails estén verificados
- Revisa que los roles estén asignados en la tabla `profiles`

### "Database connection error"
- Verifica las variables de entorno en Vercel
- Confirma que los scripts SQL se ejecutaron correctamente
- Revisa los logs en Vercel Dashboard

### "Unauthorized" al acceder a dashboards
- Verifica que el usuario tenga el rol correcto en `profiles`
- Cierra sesión y vuelve a iniciar
- Revisa las políticas RLS en Supabase

### El chatbot no responde
- Verifica que las FAQs estén insertadas en la base de datos
- Revisa los logs de la API en Vercel
- Confirma que el modelo de IA esté disponible

---

## 📊 Monitoreo

### Logs de Vercel
1. Ve a tu proyecto en Vercel
2. Haz clic en **"Logs"**
3. Filtra por errores o warnings

### Métricas de Supabase
1. Ve a tu proyecto en Supabase
2. Haz clic en **"Database"** > **"Usage"**
3. Monitorea queries y conexiones

---

## 🔐 Seguridad en Producción

1. **Cambiar contraseñas de usuarios de prueba**
2. **Habilitar 2FA en Supabase**
3. **Configurar rate limiting**
4. **Revisar políticas RLS regularmente**
5. **Monitorear logs de autenticación**

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la configuración de Supabase
3. Consulta la documentación de Next.js y Supabase
4. Abre un issue en el repositorio (si aplica)
