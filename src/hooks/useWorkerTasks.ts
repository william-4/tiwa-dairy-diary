import { supabase } from '@/integrations/supabase/client';

/**
 * Assigns the 'worker' role to a user by email.
 * @param workerEmail - Email of the user to assign as worker
 * @param assignedById - User ID of the farm owner assigning the role
 */
export async function assignWorkerRoleByEmail(workerEmail: string, assignedById: string) {
  // 1. Get user by email from auth.users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', workerEmail)
    .maybeSingle();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  // 2. Insert into user_roles
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userData.id,
      role: 'worker',
      assigned_by: assignedById,
    });

  if (roleError) {
    throw new Error('Failed to assign worker role');
  }

  return true;
}

export const useWorkerTasks = (workerName: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', workerName],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', workerName)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};