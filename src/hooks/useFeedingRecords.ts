
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type FeedingRecord = Tables<'feeding_records'>;
type FeedingRecordInsert = TablesInsert<'feeding_records'>;

export const useFeedingRecords = (animalId: string) => {
  return useQuery({
    queryKey: ['feeding_records', animalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feeding_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as FeedingRecord[];
    },
    enabled: !!animalId,
  });
};

export const useCreateFeedingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<FeedingRecordInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('feeding_records')
        .insert({ ...record, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feeding_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Feeding record added successfully!",
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

export const useUpdateFeedingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FeedingRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('feeding_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feeding_records', data.animal_id] });
      toast({
        title: "Success",
        description: "Feeding record updated successfully!",
      });
    },
  });
};
