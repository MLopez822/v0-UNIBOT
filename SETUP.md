# Guía de Configuración - UniBot

## Paso 1: Ejecutar Scripts SQL en Supabase

Antes de usar la aplicación, debes crear las tablas en Supabase. Sigue estos pasos:

### Opción A: Desde v0 (Recomendado)
1. Los scripts SQL están en la carpeta `/scripts`
2. v0 puede ejecutarlos automáticamente por ti
3. Ejecuta los scripts en orden:
   - `001_create_tables.sql` - Crea las tablas principales
   - `002_create_profile_trigger.sql` - Crea el trigger para perfiles
   - `003_seed_faqs.sql` - Inserta las FAQs iniciales

### Opción B: Desde Supabase Dashboard
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **SQL Editor**
3. Copia y pega cada script en orden
4. Ejecuta cada script haciendo clic en "Run"

## Paso 2: Crear Usuarios de Prueba

Los usuarios NO se pueden crear directamente en la base de datos. Debes crearlos a través de Supabase Auth:

### Desde Supabase Dashboard:
1. Ve a **Authentication > Users**
2. Haz clic en **"Add user"**
3. Crea estos 3 usuarios:

**Usuario Estudiante:**
- Email: `estudiante@udemedellin.edu.co`
- Password: `estudiante123`
- Marca "Auto Confirm User" ✓

**Usuario Soporte:**
- Email: `soporte@udemedellin.edu.co`
- Password: `soporte123`
- Marca "Auto Confirm User" ✓

**Usuario Admin:**
- Email: `admin@udemedellin.edu.co`
- Password: `admin123`
- Marca "Auto Confirm User" ✓

### Asignar Roles:
Después de crear los usuarios, ve a **Database > profiles** y actualiza el campo `role`:
- Para `estudiante@udemedellin.edu.co`: role = `student`
- Para `soporte@udemedellin.edu.co`: role = `support`
- Para `admin@udemedellin.edu.co`: role = `admin`

## Paso 3: Verificar Configuración

1. **Variables de Entorno**: Ya están configuradas automáticamente en Vercel
2. **Tablas Creadas**: Verifica en Supabase > Database que existan:
   - profiles
   - conversations
   - messages
   - support_cases
   - faqs
3. **RLS Habilitado**: Todas las tablas deben tener Row Level Security activado

## Paso 4: Probar la Aplicación

1. Ve a la página principal
2. Haz clic en "Iniciar Sesión"
3. Usa uno de los usuarios creados
4. Deberías ver el menú de usuario en la esquina superior derecha
5. Navega a las diferentes secciones según tu rol

## Solución de Problemas

### Error: "Invalid login credentials"
- Verifica que el usuario esté creado en Supabase Auth
- Verifica que el email esté confirmado (Auto Confirm User)
- Verifica que la contraseña sea correcta

### Error: "relation profiles does not exist"
- Las tablas no están creadas
- Ejecuta los scripts SQL en orden

### Error al enviar mensaje en el chat
- Verifica que las tablas `profiles` y `faqs` existan
- Verifica que el usuario tenga un perfil en la tabla `profiles`
- Revisa los logs de la consola del navegador para más detalles

### No puedo acceder a Admin/Support
- Verifica que el campo `role` en la tabla `profiles` esté correctamente asignado
- Los roles válidos son: `student`, `support`, `admin`

## Estructura de Roles

- **student**: Acceso al chat y puede escalar casos
- **support**: Acceso al chat y panel de soporte
- **admin**: Acceso completo (chat, admin, soporte)
