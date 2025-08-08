
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type FinancialRecord = Tables<'financial_records'>;
type FinancialRecordInsert = TablesInsert<'financial_records'>;

export const useFinancialRecords = () => {
  return useQuery({
    queryKey: ['financial_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_records')
        .select(`
          *,
          animals (
            name,
            tag
          )
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch a single financial record by description (used for linking to health record)
export const useGetFinancialRecord = (description: string) => {
  return useQuery({
    queryKey: ['financial_records', description],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('description', description)
        .single(); // Only one record expected per health record

      if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
      return data;
    },
    enabled: !!description, // Only run if description is provided
  });
};


export const useCreateFinancialRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<FinancialRecordInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('financial_records')
        .insert({ ...record, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_records'] });
      toast({
        title: "Success",
        description: "Financial record added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFinancialRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FinancialRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('financial_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_records'] });
      toast({
        title: "Success",
        description: "Financial record updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFinancialRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_records'] });
      toast({
        title: "Success",
        description: "Financial record deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
