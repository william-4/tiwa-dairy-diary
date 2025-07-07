
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types/auth';

export const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return 'worker'; // Default to worker if no role found
    }
    
    return data?.role || 'worker';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'worker';
  }
};
