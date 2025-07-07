
-- Add inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Feed', 'Medicine', 'Equipment')),
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  reorder_level NUMERIC DEFAULT 0,
  supplier_name TEXT,
  supplier_contact TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory" 
  ON public.inventory 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory" 
  ON public.inventory 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory" 
  ON public.inventory 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory" 
  ON public.inventory 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  animal_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('Deworming', 'Heat Detection', 'Dry-off', 'Calving', 'Payment', 'Custom')),
  due_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval INTEGER, -- days
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for reminders
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" 
  ON public.reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
  ON public.reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
  ON public.reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
  ON public.reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add supplier and buyer fields to financial_records
ALTER TABLE public.financial_records 
ADD COLUMN supplier_name TEXT,
ADD COLUMN supplier_contact TEXT,
ADD COLUMN buyer_name TEXT,
ADD COLUMN buyer_contact TEXT,
ADD COLUMN receipt_photo_url TEXT;

-- Add date_served field to breeding_records and function for expected calving
ALTER TABLE public.breeding_records 
ADD COLUMN date_served DATE;

-- Create function to calculate expected calving date
CREATE OR REPLACE FUNCTION calculate_expected_calving_date(date_served DATE)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT date_served + INTERVAL '283 days'
$$;

-- Update existing breeding records to set expected_calving_date based on date_served
UPDATE public.breeding_records 
SET expected_calving_date = calculate_expected_calving_date(date_served)
WHERE date_served IS NOT NULL AND expected_calving_date IS NULL;
