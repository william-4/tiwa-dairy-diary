
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type HealthRecord = Tables<'health_records'>;
type HealthRecordInsert = TablesInsert<'health_records'>;

export const useHealthRecords = (animalId: string) => {
  return useQuery({
    queryKey: ['health_records', animalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as HealthRecord[];
    },
    enabled: !!animalId,
  });
};

export const useCreateHealthRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<HealthRecordInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('health_records')
        .insert({ ...record, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Health record added successfully!",
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

export const useUpdateHealthRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HealthRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('health_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Health record updated successfully!",
      });
    },
  });
};
