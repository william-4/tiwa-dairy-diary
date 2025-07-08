-- Add cost field to inventory table
ALTER TABLE public.inventory 
ADD COLUMN cost NUMERIC;