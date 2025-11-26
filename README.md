# UniBot - Asistente Virtual de la Universidad de Medellín

UniBot es una aplicación web completa de chatbot inteligente diseñada para la Universidad de Medellín. Permite a los estudiantes obtener respuestas instantáneas sobre información universitaria, mientras que el personal de soporte y administradores pueden gestionar conversaciones y casos escalados.

## 🚀 Características Principales

### Para Estudiantes
- **Chat con IA**: Interfaz de chat inteligente que responde preguntas sobre la universidad usando GPT-4o-mini
- **Historial de Conversaciones**: Acceso a todas las conversaciones previas
- **Escalamiento de Casos**: Posibilidad de escalar consultas complejas al equipo de soporte
- **Calificación de Respuestas**: Sistema de valoración de satisfacción (1-5 estrellas)
- **Chat Popup**: Widget flotante en la página principal para acceso rápido

### Para Personal de Soporte
- **Dashboard de Casos**: Visualización de todos los casos escalados
- **Gestión de Casos**: Actualización de estado, prioridad y resolución
- **Filtros Avanzados**: Búsqueda por estado, prioridad, cliente y fechas
- **Métricas en Tiempo Real**: Estadísticas de casos totales, abiertos, completados y pendientes

### Para Administradores
- **Panel de Administración**: Vista completa de métricas del sistema
- **Gestión de Usuarios**: Administración de roles y permisos
- **Análisis de Conversaciones**: Historial completo con filtros por fecha y satisfacción
- **Exportación de Datos**: Descarga de datos en formato CSV
- **Métricas Clave**: Total de conversaciones, satisfacción promedio, usuarios activos y casos escalados

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: Next.js 16 con React 19.2
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth con Row Level Security (RLS)
- **IA**: Vercel AI SDK con GPT-4o-mini
- **Despliegue**: Vercel
  
## 👥 Usuarios Predeterminados

La aplicación viene con 3 usuarios de prueba precreados:

### 1. Estudiante
- **Email**: `estudiante@udemedellin.edu.co`
- **Contraseña**: `estudiante123`
- **Rol**: Student
- **Acceso**: Chat con IA, historial de conversaciones, escalamiento de casos

### 2. Personal de Soporte
- **Email**: `soporte@udemedellin.edu.co`
- **Contraseña**: `soporte123`
- **Rol**: Support
- **Acceso**: Dashboard de soporte, gestión de casos, chat con IA

### 3. Administrador
- **Email**: `admin@udemedellin.edu.co`
- **Contraseña**: `admin123`
- **Rol**: Admin
- **Acceso**: Panel de administración, gestión de usuarios, todas las funcionalidades

## 🔐 Sistema de Autenticación y Roles

### Roles y Permisos

#### Student (Estudiante)
- ✅ Acceso a la página de chat
- ✅ Crear y ver sus propias conversaciones
- ✅ Escalar casos al equipo de soporte
- ✅ Calificar respuestas del chatbot
- ❌ No puede acceder a dashboards de admin o soporte

#### Support (Soporte)
- ✅ Acceso al dashboard de soporte
- ✅ Ver y gestionar todos los casos escalados
- ✅ Actualizar estado y prioridad de casos
- ✅ Asignarse casos
- ✅ Acceso al chat (para probar)
- ❌ No puede acceder al panel de administración

#### Admin (Administrador)
- ✅ Acceso completo al panel de administración
- ✅ Ver métricas globales del sistema
- ✅ Gestionar usuarios y roles
- ✅ Exportar datos
- ✅ Ver historial completo de conversaciones
- ✅ Acceso a todas las funcionalidades

### Seguridad (Row Level Security)

Todas las tablas están protegidas con políticas RLS:
- Los estudiantes solo pueden ver y modificar sus propios datos
- El personal de soporte puede ver todos los casos y conversaciones
- Los administradores tienen acceso completo a todos los datos

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 18+ instalado
- Cuenta de Supabase
- Cuenta de Vercel (para despliegue)

### Pasos de Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd unibot-university-chatbot
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**

Las siguientes variables ya están configuradas en el proyecto de Vercel:
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

4. **Ejecutar scripts de base de datos**

Los scripts SQL en la carpeta `/scripts` deben ejecutarse en orden:
- `001_create_tables.sql` - Crea las tablas principales
- `002_create_profile_trigger.sql` - Crea el trigger para perfiles
- `003_seed_faqs.sql` - Inserta FAQs iniciales
- `004_seed_test_users.sql` - Crea usuarios de prueba

Estos scripts se pueden ejecutar directamente desde v0 o desde el panel de Supabase.

5. **Iniciar el servidor de desarrollo**
\`\`\`bash
npm run dev
\`\`\`

6. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`


## 🚀 Despliegue en Vercel

La aplicación está lista para desplegarse en Vercel:

1. Conecta el repositorio a Vercel
2. Las variables de entorno ya están configuradas
3. Vercel detecta automáticamente Next.js
4. El despliegue se realiza automáticamente

## 📄 Licencia

© 2025 Universidad de Medellín. Todos los derechos reservados.

