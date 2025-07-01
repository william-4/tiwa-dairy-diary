
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type BreedingRecord = Tables<'breeding_records'>;
type BreedingRecordInsert = TablesInsert<'breeding_records'>;

export const useBreedingRecords = (animalId: string) => {
  return useQuery({
    queryKey: ['breeding_records', animalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breeding_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('date_of_heat', { ascending: false });
      
      if (error) throw error;
      return data as BreedingRecord[];
    },
    enabled: !!animalId,
  });
};

export const useCreateBreedingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<BreedingRecordInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('breeding_records')
        .insert({ ...record, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['breeding_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Breeding record added successfully!",
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

export const useUpdateBreedingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BreedingRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('breeding_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['breeding_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Breeding record updated successfully!",
      });
    },
  });
};
