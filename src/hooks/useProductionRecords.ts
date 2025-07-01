
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type ProductionRecord = Tables<'production_records'>;
type ProductionRecordInsert = TablesInsert<'production_records'>;

export const useProductionRecords = (animalId: string) => {
  return useQuery({
    queryKey: ['production_records', animalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('production_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as ProductionRecord[];
    },
    enabled: !!animalId,
  });
};

export const useCreateProductionRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<ProductionRecordInsert, 'user_id' | 'total_yield'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const total_yield = (record.am_yield || 0) + (record.pm_yield || 0);

      const { data, error } = await supabase
        .from('production_records')
        .insert({ ...record, user_id: user.id, total_yield })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['production_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Production record added successfully!",
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

export const useUpdateProductionRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductionRecord> & { id: string }) => {
      const total_yield = (updates.am_yield || 0) + (updates.pm_yield || 0);
      
      const { data, error } = await supabase
        .from('production_records')
        .update({ ...updates, total_yield })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['production_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Production record updated successfully!",
      });
    },
  });
};
