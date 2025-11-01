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

### Estructura de la Base de Datos

#### Tabla: `profiles`
- `id` (UUID): ID del usuario (referencia a auth.users)
- `email` (TEXT): Correo electrónico
- `full_name` (TEXT): Nombre completo
- `role` (TEXT): Rol del usuario (student, support, admin)
- `created_at` (TIMESTAMP): Fecha de creación

#### Tabla: `conversations`
- `id` (UUID): ID de la conversación
- `user_id` (UUID): ID del usuario
- `title` (TEXT): Título de la conversación
- `rating` (INTEGER): Calificación (1-5)
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Última actualización

#### Tabla: `messages`
- `id` (UUID): ID del mensaje
- `conversation_id` (UUID): ID de la conversación
- `role` (TEXT): Rol (user o assistant)
- `content` (TEXT): Contenido del mensaje
- `created_at` (TIMESTAMP): Fecha de creación

#### Tabla: `support_cases`
- `id` (UUID): ID del caso
- `conversation_id` (UUID): ID de la conversación relacionada
- `user_id` (UUID): ID del usuario
- `subject` (TEXT): Asunto del caso
- `description` (TEXT): Descripción detallada
- `status` (TEXT): Estado (open, in_progress, resolved, closed)
- `priority` (TEXT): Prioridad (low, medium, high, urgent)
- `assigned_to` (UUID): ID del agente asignado
- `resolution` (TEXT): Resolución del caso
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Última actualización

#### Tabla: `faqs`
- `id` (UUID): ID de la FAQ
- `question` (TEXT): Pregunta
- `answer` (TEXT): Respuesta
- `category` (TEXT): Categoría
- `created_at` (TIMESTAMP): Fecha de creación

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

## 📋 Cómo Funciona la Aplicación

### 1. Página Principal (Pública)
- **URL**: `/`
- **Descripción**: Landing page de la Universidad de Medellín
- **Características**:
  - Hero section con llamado a la acción
  - Sección de facultades (6 facultades principales)
  - Noticias recientes de la universidad
  - Footer con información de contacto
  - **Chat Popup**: Botón flotante rojo en la esquina inferior derecha
    - Al hacer clic, se abre un popup de chat
    - Requiere inicio de sesión para usar
    - Botón de expandir para ir a la página completa del chat
    - Botón de cerrar para ocultar el popup

### 2. Sistema de Chat con IA
- **URL**: `/chat`
- **Acceso**: Requiere autenticación (cualquier rol)
- **Funcionalidad**:
  - Sidebar con historial de conversaciones
  - Área de chat principal con mensajes en tiempo real
  - El chatbot responde usando GPT-4o-mini
  - Contexto de FAQs para respuestas más precisas
  - Botón "Nueva Conversación" para iniciar un nuevo chat
  - Opción de escalar casos complejos al soporte
  - Sistema de calificación de satisfacción (1-5 estrellas)

### 3. Dashboard de Soporte
- **URL**: `/support`
- **Acceso**: Solo usuarios con rol `support` o `admin`
- **Funcionalidad**:
  - Tarjetas de métricas: Casos totales, abiertos, completados, pendientes
  - Filtros por estado, prioridad, cliente y rango de fechas
  - Tabla de casos con información detallada
  - Modal para actualizar estado, prioridad y resolución
  - Badges de colores para estados y prioridades
  - Paginación de resultados

### 4. Panel de Administración
- **URL**: `/admin`
- **Acceso**: Solo usuarios con rol `admin`
- **Funcionalidad**:
  - Métricas globales: Total conversaciones, satisfacción promedio, usuarios activos, casos escalados
  - Filtros por fecha y nivel de satisfacción
  - Historial completo de conversaciones
  - Botón "Gestionar Usuarios" para administración de usuarios
  - Botón "Exportar Datos" para descargar CSV
  - Tabla con detalles de cada conversación

### 5. Gestión de Usuarios (Admin)
- **URL**: `/admin/users`
- **Acceso**: Solo usuarios con rol `admin`
- **Funcionalidad**:
  - Lista completa de usuarios registrados
  - Información de email, nombre, rol y fecha de registro
  - Actualización de roles de usuario
  - Búsqueda y filtrado de usuarios

## 🚦 Flujo de Uso Típico

### Para un Estudiante:
1. Visita la página principal
2. Hace clic en "Iniciar Sesión" o en el botón flotante del chat
3. Inicia sesión con sus credenciales
4. Accede al chat desde el popup o la página completa
5. Hace preguntas sobre la universidad
6. Si la respuesta no es satisfactoria, puede escalar el caso
7. Califica la conversación al finalizar

### Para Personal de Soporte:
1. Inicia sesión con credenciales de soporte
2. Es redirigido automáticamente a `/support`
3. Ve todos los casos escalados
4. Filtra por prioridad o estado
5. Abre un caso y actualiza su estado
6. Agrega una resolución cuando el caso está completo
7. Marca el caso como "Resuelto" o "Cerrado"

### Para un Administrador:
1. Inicia sesión con credenciales de admin
2. Es redirigido automáticamente a `/admin`
3. Revisa las métricas globales del sistema
4. Filtra conversaciones por fecha o satisfacción
5. Exporta datos para análisis externo
6. Gestiona usuarios y actualiza roles según sea necesario

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

## 📊 Base de Conocimiento (FAQs)

El chatbot viene precargado con 10 FAQs sobre la Universidad de Medellín:

1. ¿Cuáles son los programas de pregrado disponibles?
2. ¿Cómo puedo inscribirme en la universidad?
3. ¿Cuál es el costo de la matrícula?
4. ¿Ofrecen becas o ayudas financieras?
5. ¿Dónde está ubicada la universidad?
6. ¿Cuál es el horario de atención?
7. ¿Cómo puedo contactar con admisiones?
8. ¿Ofrecen programas de posgrado?
9. ¿Tienen programas de intercambio internacional?
10. ¿Cómo puedo acceder a la biblioteca?

Estas FAQs se utilizan como contexto para que el chatbot proporcione respuestas más precisas y relevantes.

## 🎨 Diseño y Branding

### Colores Oficiales
- **Azul Marino**: `#1e3a5f` (unibot-blue)
- **Rojo Universidad**: `#C8102E` (unibot-red)
- **Dorado**: `#D4AF37` (unibot-gold)
- **Gris Claro**: `#f8f9fa` (backgrounds)

### Tipografía
- **Sans-serif**: Geist (para textos generales)
- **Monospace**: Geist Mono (para código)

### Componentes UI
- Basados en shadcn/ui
- Tailwind CSS v4 para estilos
- Diseño responsive (mobile-first)

## 🔄 Flujo de Datos

### Chat con IA
1. Usuario envía mensaje → `/api/chat`
2. API busca FAQs relevantes en Supabase
3. Construye contexto con FAQs
4. Envía prompt a GPT-4o-mini vía AI SDK
5. Streaming de respuesta al cliente
6. Guarda mensaje en base de datos

### Escalamiento de Casos
1. Usuario hace clic en "Escalar Caso"
2. Completa formulario con asunto y descripción
3. POST a `/api/conversations/[id]/escalate`
4. Crea registro en tabla `support_cases`
5. Caso aparece en dashboard de soporte

### Gestión de Casos (Soporte)
1. Soporte abre caso desde dashboard
2. Actualiza estado/prioridad/resolución
3. PATCH a `/api/support/cases/[id]`
4. Actualiza registro en base de datos
5. Cambios reflejados en tiempo real

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: 1920px+ (experiencia completa)
- **Laptop**: 1024px - 1919px (diseño adaptado)
- **Tablet**: 768px - 1023px (navegación simplificada)
- **Mobile**: 320px - 767px (interfaz móvil optimizada)

## 🔒 Seguridad

### Implementaciones de Seguridad
- **Row Level Security (RLS)**: Todas las tablas protegidas
- **Middleware de Autenticación**: Protección de rutas sensibles
- **Validación de Roles**: Control de acceso basado en roles
- **Tokens JWT**: Autenticación segura con Supabase
- **Variables de Entorno**: Claves API protegidas

## 🚀 Despliegue en Vercel

La aplicación está lista para desplegarse en Vercel:

1. Conecta el repositorio a Vercel
2. Las variables de entorno ya están configuradas
3. Vercel detecta automáticamente Next.js
4. El despliegue se realiza automáticamente

## 📞 Soporte y Contacto

Para soporte técnico o consultas:
- **Email**: soporte@udemedellin.edu.co
- **Teléfono**: +57 (4) 340 5555
- **Dirección**: Carrera 87 No. 30-65, Medellín, Colombia

## 📄 Licencia

© 2025 Universidad de Medellín. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la Universidad de Medellín**
