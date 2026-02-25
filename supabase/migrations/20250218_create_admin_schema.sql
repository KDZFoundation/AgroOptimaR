-- Create app_role enum
CREATE TYPE app_role AS ENUM ('rolnik', 'doradca', 'admin');

-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role app_role NOT NULL DEFAULT 'rolnik',
  imie TEXT,
  nazwisko TEXT,
  numer_producenta TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow users to update their own profile (except role)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, imie, nazwisko)
  VALUES (new.id, 'rolnik', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- DICTIONARY TABLES

-- Plants (Uprawy)
CREATE TABLE IF NOT EXISTS public.slownik_uprawy (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kod TEXT UNIQUE NOT NULL,
  nazwa TEXT NOT NULL,
  grupa TEXT, -- np. zboża, okopowe
  czy_wspierana BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eco-schemes (Ekoschematy)
CREATE TABLE IF NOT EXISTS public.slownik_ekoschematy (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kod TEXT UNIQUE NOT NULL,
  nazwa TEXT NOT NULL,
  punkty NUMERIC(10,2) DEFAULT 0, -- np. 5.00 pkt
  stawka_pln NUMERIC(10,2) DEFAULT 0, -- np. 100.00 PLN (opcjonalnie, jeśli są punkty to to może być null)
  opis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for dictionaries
ALTER TABLE public.slownik_uprawy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slownik_ekoschematy ENABLE ROW LEVEL SECURITY;

-- Dictionary Policies: Everyone can read
CREATE POLICY "Everyone can view uprawy" ON public.slownik_uprawy FOR SELECT USING (true);
CREATE POLICY "Everyone can view ekoschematy" ON public.slownik_ekoschematy FOR SELECT USING (true);

-- Dictionary Policies: Only Admins can modify
CREATE POLICY "Admins can insert uprawy" ON public.slownik_uprawy
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update uprawy" ON public.slownik_uprawy
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete uprawy" ON public.slownik_uprawy
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert ekoschematy" ON public.slownik_ekoschematy
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update ekoschematy" ON public.slownik_ekoschematy
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete ekoschematy" ON public.slownik_ekoschematy
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
