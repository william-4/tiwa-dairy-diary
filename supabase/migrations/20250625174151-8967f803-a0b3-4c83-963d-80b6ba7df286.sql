
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  farm_name TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create animals table
CREATE TABLE public.animals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  tag TEXT,
  breed TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  source TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'Female',
  notes TEXT,
  photo_url TEXT,
  health_status TEXT DEFAULT 'Healthy',
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feeding records table
CREATE TABLE public.feeding_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES public.animals ON DELETE CASCADE,
  date DATE NOT NULL,
  feed_type TEXT NOT NULL,
  quantity DECIMAL,
  source_of_feed TEXT,
  cost DECIMAL,
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create production records table
CREATE TABLE public.production_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES public.animals ON DELETE CASCADE,
  date DATE NOT NULL,
  am_yield DECIMAL,
  pm_yield DECIMAL,
  total_yield DECIMAL,
  use_type TEXT,
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health records table
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES public.animals ON DELETE CASCADE,
  date DATE NOT NULL,
  health_issue TEXT,
  treatment_given TEXT,
  vet_name TEXT,
  cost DECIMAL,
  vaccine_dewormer TEXT,
  recovery_status TEXT,
  next_appointment DATE,
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create breeding records table
CREATE TABLE public.breeding_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES public.animals ON DELETE CASCADE,
  date_of_heat DATE,
  mating_method TEXT,
  bull_ai_source TEXT,
  conception_status TEXT,
  pregnancy_confirmation_date DATE,
  expected_calving_date DATE,
  actual_calving_date DATE,
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeding_records ENABLE ROW LEVEL SECURITY;

-- Create policies for animals (no DELETE policy)
CREATE POLICY "Users can view their own animals"
  ON public.animals FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own animals"
  ON public.animals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own animals"
  ON public.animals FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for feeding records (no DELETE policy)
CREATE POLICY "Users can view their own feeding records"
  ON public.feeding_records FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own feeding records"
  ON public.feeding_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feeding records"
  ON public.feeding_records FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for production records (no DELETE policy)
CREATE POLICY "Users can view their own production records"
  ON public.production_records FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own production records"
  ON public.production_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own production records"
  ON public.production_records FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for health records (no DELETE policy)
CREATE POLICY "Users can view their own health records"
  ON public.health_records FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own health records"
  ON public.health_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health records"
  ON public.health_records FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for breeding records (no DELETE policy)
CREATE POLICY "Users can view their own breeding records"
  ON public.breeding_records FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own breeding records"
  ON public.breeding_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breeding records"
  ON public.breeding_records FOR UPDATE
  USING (auth.uid() = user_id);

-- Create history tables
CREATE TABLE public.animals_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT,
  tag TEXT,
  breed TEXT,
  date_of_birth DATE,
  source TEXT,
  gender TEXT,
  notes TEXT,
  photo_url TEXT,
  health_status TEXT,
  operation_type TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by UUID REFERENCES auth.users
);

-- Enable RLS on history tables
ALTER TABLE public.animals_history ENABLE ROW LEVEL SECURITY;

-- Create policies for history tables (read-only)
CREATE POLICY "Users can view their own animals history"
  ON public.animals_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create triggers to automatically track history
CREATE OR REPLACE FUNCTION public.track_animals_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.animals_history (
      animal_id, user_id, name, tag, breed, date_of_birth, source, gender, notes, photo_url, health_status,
      operation_type, changed_by
    ) VALUES (
      NEW.id, NEW.user_id, NEW.name, NEW.tag, NEW.breed, NEW.date_of_birth, NEW.source, NEW.gender, NEW.notes, NEW.photo_url, NEW.health_status,
      'INSERT', auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.animals_history (
      animal_id, user_id, name, tag, breed, date_of_birth, source, gender, notes, photo_url, health_status,
      operation_type, changed_by
    ) VALUES (
      NEW.id, NEW.user_id, NEW.name, NEW.tag, NEW.breed, NEW.date_of_birth, NEW.source, NEW.gender, NEW.notes, NEW.photo_url, NEW.health_status,
      'UPDATE', auth.uid()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER animals_history_trigger
  AFTER INSERT OR UPDATE ON public.animals
  FOR EACH ROW EXECUTE FUNCTION public.track_animals_history();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
