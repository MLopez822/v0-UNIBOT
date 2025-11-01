# Guía para Crear Usuarios en UniBot

## Problema Actual

Los usuarios de prueba (admin, soporte, estudiante) necesitan ser creados manualmente en Supabase porque no se pueden insertar directamente en la base de datos con contraseñas.

## Solución: Crear Usuarios desde Supabase Dashboard

### Paso 1: Acceder a Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión y selecciona tu proyecto
3. Ve a **Authentication** > **Users** en el menú lateral

### Paso 2: Crear los 3 Usuarios

#### Usuario 1: Administrador

1. Haz clic en **"Add user"** > **"Create new user"**
2. Completa los campos:
   - **Email**: `admin@udemedellin.edu.co`
   - **Password**: `admin123`
   - **Auto Confirm User**: ✅ Activado (importante)
3. Haz clic en **"Create user"**

#### Usuario 2: Soporte Técnico

1. Haz clic en **"Add user"** > **"Create new user"**
2. Completa los campos:
   - **Email**: `soporte@udemedellin.edu.co`
   - **Password**: `soporte123`
   - **Auto Confirm User**: ✅ Activado
3. Haz clic en **"Create user"**

#### Usuario 3: Estudiante

1. Haz clic en **"Add user"** > **"Create new user"**
2. Completa los campos:
   - **Email**: `estudiante@udemedellin.edu.co`
   - **Password**: `estudiante123`
   - **Auto Confirm User**: ✅ Activado
3. Haz clic en **"Create user"**

### Paso 3: Ejecutar Script para Crear Perfiles

Después de crear los usuarios en Authentication, necesitas ejecutar el script SQL para crear sus perfiles con los roles correctos:

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido del archivo `scripts/004_create_admin_profiles.sql`
3. Haz clic en **"Run"**

Este script:
- Busca los usuarios que acabas de crear
- Crea sus perfiles en la tabla `profiles`
- Asigna los roles correctos (admin, support, student)

### Paso 4: Verificar

1. Ve a **Database** > **Table Editor** > **profiles**
2. Deberías ver 3 registros con:
   - admin@udemedellin.edu.co (role: admin)
   - soporte@udemedellin.edu.co (role: support)
   - estudiante@udemedellin.edu.co (role: student)

## Credenciales de Acceso

Una vez completados los pasos anteriores, puedes iniciar sesión con:

**Administrador:**
- Email: `admin@udemedellin.edu.co`
- Contraseña: `admin123`
- Acceso: Chat, Dashboard Admin, Dashboard Soporte

**Soporte Técnico:**
- Email: `soporte@udemedellin.edu.co`
- Contraseña: `soporte123`
- Acceso: Chat, Dashboard Soporte

**Estudiante:**
- Email: `estudiante@udemedellin.edu.co`
- Contraseña: `estudiante123`
- Acceso: Chat

## Notas Importantes

- **Auto Confirm User** debe estar activado para que los usuarios puedan iniciar sesión inmediatamente sin verificar email
- El trigger automático (`handle_new_user`) creará el perfil básico, pero el script `004_create_admin_profiles.sql` asegura que tengan los roles correctos
- Si un usuario ya existe, el script actualizará su rol sin crear duplicados (usa `ON CONFLICT`)
</parameter>
