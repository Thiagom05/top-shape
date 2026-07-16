-- 1. Create custom ENUM types if they do not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'photo_phase') THEN
    CREATE TYPE photo_phase AS ENUM ('before', 'after');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'photo_view') THEN
    CREATE TYPE photo_view AS ENUM ('front', 'side', 'back');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
    CREATE TYPE resource_type AS ENUM ('video', 'pdf');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_category') THEN
    CREATE TYPE resource_category AS ENUM ('welcome', 'training', 'nutrition');
  END IF;
END$$;

-- 2. Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NULL,
  last_name VARCHAR(100) NULL,
  phone VARCHAR(20) NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  phase photo_phase NOT NULL,
  view photo_view NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_phase_view UNIQUE (user_id, phase, view)
);

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type resource_type NOT NULL,
  category resource_category NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, last_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = excluded.name,
    last_name = excluded.last_name,
    email = excluded.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 6. Table RLS Policies
-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by owner and admin" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner and admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Profiles can be updated by owner and admin" ON public.profiles;
CREATE POLICY "Profiles can be updated by owner and admin" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Progress Photos
DROP POLICY IF EXISTS "Users can view their own progress photos, admins can view all" ON public.progress_photos;
CREATE POLICY "Users can view their own progress photos, admins can view all" ON public.progress_photos
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own progress photos" ON public.progress_photos;
CREATE POLICY "Users can insert their own progress photos" ON public.progress_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress photos" ON public.progress_photos;
CREATE POLICY "Users can update their own progress photos" ON public.progress_photos
  FOR UPDATE USING (auth.uid() = user_id);

-- Resources
DROP POLICY IF EXISTS "Authenticated users can view resources" ON public.resources;
CREATE POLICY "Authenticated users can view resources" ON public.resources
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
CREATE POLICY "Admins can manage resources" ON public.resources
  FOR ALL USING (public.is_admin());

-- 7. Buckets initialization in Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('progress-photos', 'progress-photos', false),
  ('documents', 'documents', false),
  ('videos', 'videos', false)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS Policies
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; (Enabled by default, fails due to ownership privileges)

-- progress-photos storage policies
DROP POLICY IF EXISTS "Users can manage their own folder in progress-photos" ON storage.objects;
CREATE POLICY "Users can manage their own folder in progress-photos" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'progress-photos' AND (
      (select auth.uid()::text) = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Admins can view all progress photos in storage" ON storage.objects;
CREATE POLICY "Admins can view all progress photos in storage" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'progress-photos' AND (
      exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    )
  );

-- documents storage policies
DROP POLICY IF EXISTS "Authenticated users can read documents in storage" ON storage.objects;
CREATE POLICY "Authenticated users can read documents in storage" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admins can manage documents in storage" ON storage.objects;
CREATE POLICY "Admins can manage documents in storage" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'documents' AND (
      exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    )
  );

-- videos storage policies
DROP POLICY IF EXISTS "Authenticated users can read videos in storage" ON storage.objects;
CREATE POLICY "Authenticated users can read videos in storage" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Admins can manage videos in storage" ON storage.objects;
CREATE POLICY "Admins can manage videos in storage" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'videos' AND (
      exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    )
  );

-- 9. Permissions Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress_photos TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO anon, authenticated, service_role;

