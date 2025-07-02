
-- Add missing columns to production_records table
ALTER TABLE public.production_records 
ADD COLUMN noon_yield numeric DEFAULT NULL,
ADD COLUMN price_per_litre numeric DEFAULT NULL;

-- Update the trigger to handle the new noon_yield in total_yield calculation
CREATE OR REPLACE FUNCTION update_production_total_yield()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_yield = COALESCE(NEW.am_yield, 0) + COALESCE(NEW.noon_yield, 0) + COALESCE(NEW.pm_yield, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate total_yield
DROP TRIGGER IF EXISTS production_records_total_yield_trigger ON public.production_records;
CREATE TRIGGER production_records_total_yield_trigger
  BEFORE INSERT OR UPDATE ON public.production_records
  FOR EACH ROW
  EXECUTE FUNCTION update_production_total_yield();
