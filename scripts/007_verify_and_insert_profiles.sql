-- Verify and insert profiles for existing auth users
-- This script checks if profiles exist and creates them if missing

DO $$
DECLARE
  admin_user_id UUID;
  support_user_id UUID;
  student_user_id UUID;
BEGIN
  -- Find user IDs from auth.users
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@udemedellin.edu.co';
  SELECT id INTO support_user_id FROM auth.users WHERE email = 'soporte@udemedellin.edu.co';
  SELECT id INTO student_user_id FROM auth.users WHERE email = 'estudiante@udemedellin.edu.co';

  -- Insert or update admin profile
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (admin_user_id, 'admin@udemedellin.edu.co', 'Administrador', 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', full_name = 'Administrador', updated_at = NOW();
    
    RAISE NOTICE 'Admin profile created/updated for user ID: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Admin user not found in auth.users';
  END IF;

  -- Insert or update support profile
  IF support_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (support_user_id, 'soporte@udemedellin.edu.co', 'Soporte Técnico', 'support')
    ON CONFLICT (id) DO UPDATE
    SET role = 'support', full_name = 'Soporte Técnico', updated_at = NOW();
    
    RAISE NOTICE 'Support profile created/updated for user ID: %', support_user_id;
  ELSE
    RAISE NOTICE 'Support user not found in auth.users';
  END IF;

  -- Insert or update student profile
  IF student_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role, student_id)
    VALUES (student_user_id, 'estudiante@udemedellin.edu.co', 'Estudiante Demo', 'student', 'EST001')
    ON CONFLICT (id) DO UPDATE
    SET role = 'student', full_name = 'Estudiante Demo', student_id = 'EST001', updated_at = NOW();
    
    RAISE NOTICE 'Student profile created/updated for user ID: %', student_user_id;
  ELSE
    RAISE NOTICE 'Student user not found in auth.users';
  END IF;
END $$;

-- Verify the profiles were created
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
