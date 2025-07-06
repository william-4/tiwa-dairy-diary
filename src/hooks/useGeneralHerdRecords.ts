
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type GeneralHerdRecord = Tables<'general_herd_records'>;
type GeneralHerdRecordInsert = TablesInsert<'general_herd_records'>;

export const useGeneralHerdRecords = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['generalHerdRecords'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('general_herd_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching general herd records:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateGeneralHerdRecord = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (record: Omit<GeneralHerdRecordInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('general_herd_records')
        .insert({
          ...record,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating general herd record:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalHerdRecords'] });
    },
  });
};

export const useUpdateGeneralHerdRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, record }: { id: string; record: Partial<GeneralHerdRecord> }) => {
      const { data, error } = await supabase
        .from('general_herd_records')
        .update(record)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating general herd record:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalHerdRecords'] });
    },
  });
};

export const useDeleteGeneralHerdRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('general_herd_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting general herd record:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalHerdRecords'] });
    },
  });
};
