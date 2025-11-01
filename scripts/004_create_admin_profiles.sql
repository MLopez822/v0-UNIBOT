-- Insert profiles for existing auth users that don't have profiles yet
-- This is needed because the trigger only works for NEW users

-- First, let's create a function to safely insert profiles for existing users
DO $$
DECLARE
  admin_user_id uuid;
  soporte_user_id uuid;
  estudiante_user_id uuid;
BEGIN
  -- Get user IDs from auth.users (if they exist)
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@udemedellin.edu.co' LIMIT 1;
  SELECT id INTO soporte_user_id FROM auth.users WHERE email = 'soporte@udemedellin.edu.co' LIMIT 1;
  SELECT id INTO estudiante_user_id FROM auth.users WHERE email = 'estudiante@udemedellin.edu.co' LIMIT 1;

  -- Insert admin profile if user exists
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (admin_user_id, 'admin@udemedellin.edu.co', 'Administrador', 'admin')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin', full_name = 'Administrador';
    
    RAISE NOTICE 'Admin profile created/updated for user %', admin_user_id;
  END IF;

  -- Insert soporte profile if user exists
  IF soporte_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (soporte_user_id, 'soporte@udemedellin.edu.co', 'Soporte Técnico', 'support')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'support', full_name = 'Soporte Técnico';
    
    RAISE NOTICE 'Support profile created/updated for user %', soporte_user_id;
  END IF;

  -- Insert estudiante profile if user exists
  IF estudiante_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role, student_id)
    VALUES (estudiante_user_id, 'estudiante@udemedellin.edu.co', 'María González', 'student', 'EST2024001')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'student', full_name = 'María González', student_id = 'EST2024001';
    
    RAISE NOTICE 'Student profile created/updated for user %', estudiante_user_id;
  END IF;

END $$;
