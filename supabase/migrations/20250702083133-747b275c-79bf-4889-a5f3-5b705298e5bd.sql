
-- Create a table for financial records
CREATE TABLE public.financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Income', 'Expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL,
  animal_id UUID REFERENCES public.animals(id),
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own financial records
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own financial records
CREATE POLICY "Users can view their own financial records" 
  ON public.financial_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own financial records
CREATE POLICY "Users can create their own financial records" 
  ON public.financial_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own financial records
CREATE POLICY "Users can update their own financial records" 
  ON public.financial_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own financial records
CREATE POLICY "Users can delete their own financial records" 
  ON public.financial_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_financial_records_updated_at BEFORE UPDATE ON public.financial_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
