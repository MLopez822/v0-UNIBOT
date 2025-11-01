-- Drop existing restrictive policies that block server-side queries
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Support and admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies that allow server-side access
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to view any profile for role verification
CREATE POLICY "Authenticated users can view profiles for role verification"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role full access (for server-side operations)
CREATE POLICY "Service role has full access to profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can insert profiles (for user creation)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  TO service_role
  WITH CHECK (true);
