-- Script para insertar manualmente el perfil del administrador
-- Este script debe ejecutarse DESPUÉS de crear el usuario admin en Supabase Auth

-- Primero, verifica si ya existe un perfil para este email
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Busca el ID del usuario admin en auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@udemedellin.edu.co'
  LIMIT 1;

  -- Si se encuentra el usuario, inserta o actualiza su perfil
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
    VALUES (
      admin_user_id,
      'Administrador',
      'admin@udemedellin.edu.co',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      role = 'admin',
      full_name = 'Administrador',
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil de administrador creado/actualizado exitosamente';
  ELSE
    RAISE NOTICE 'No se encontró el usuario admin@udemedellin.edu.co en auth.users. Por favor créalo primero en Authentication > Users';
  END IF;
END $$;

-- Repite para el usuario de soporte
DO $$
DECLARE
  support_user_id uuid;
BEGIN
  SELECT id INTO support_user_id
  FROM auth.users
  WHERE email = 'soporte@udemedellin.edu.co'
  LIMIT 1;

  IF support_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
    VALUES (
      support_user_id,
      'Ana María García',
      'soporte@udemedellin.edu.co',
      'support',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      role = 'support',
      full_name = 'Ana María García',
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil de soporte creado/actualizado exitosamente';
  ELSE
    RAISE NOTICE 'No se encontró el usuario soporte@udemedellin.edu.co en auth.users';
  END IF;
END $$;

-- Repite para el usuario estudiante
DO $$
DECLARE
  student_user_id uuid;
BEGIN
  SELECT id INTO student_user_id
  FROM auth.users
  WHERE email = 'estudiante@udemedellin.edu.co'
  LIMIT 1;

  IF student_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
    VALUES (
      student_user_id,
      'Carlos Estudiante',
      'estudiante@udemedellin.edu.co',
      'student',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      role = 'student',
      full_name = 'Carlos Estudiante',
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil de estudiante creado/actualizado exitosamente';
  ELSE
    RAISE NOTICE 'No se encontró el usuario estudiante@udemedellin.edu.co en auth.users';
  END IF;
END $$;

-- Verifica los perfiles creados
SELECT p.id, p.email, p.full_name, p.role, p.created_at
FROM public.profiles p
WHERE p.email IN ('admin@udemedellin.edu.co', 'soporte@udemedellin.edu.co', 'estudiante@udemedellin.edu.co')
ORDER BY p.email;
