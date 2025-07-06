
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'worker'; // Default to worker if no role found
      }
      
      return data?.role || 'worker';
    },
    enabled: !!user,
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'worker' }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
    },
  });
};
