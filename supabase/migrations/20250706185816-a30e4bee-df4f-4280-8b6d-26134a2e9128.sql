
-- Create user roles enum and table
CREATE TYPE public.user_role AS ENUM ('admin', 'worker');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'worker',
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can assign roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create general herd records table
CREATE TABLE public.general_herd_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  record_type TEXT NOT NULL, -- 'production', 'feeding', 'health', 'breeding'
  title TEXT NOT NULL,
  description TEXT,
  total_production NUMERIC, -- for production records
  total_animals_affected INTEGER, -- how many animals this affects
  cost NUMERIC, -- for feeding/health records
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on general_herd_records
ALTER TABLE public.general_herd_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for general_herd_records
CREATE POLICY "Users can view their own herd records"
  ON public.general_herd_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own herd records"
  ON public.general_herd_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own herd records"
  ON public.general_herd_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own herd records"
  ON public.general_herd_records FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger for user_roles
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for general_herd_records
CREATE TRIGGER update_general_herd_records_updated_at
  BEFORE UPDATE ON public.general_herd_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-assign admin role to first user
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the first user in the system
  IF NOT EXISTS (SELECT 1 FROM public.user_roles LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Default role for new users is worker
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'worker');
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-assign roles on user creation
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_first_user_admin();
