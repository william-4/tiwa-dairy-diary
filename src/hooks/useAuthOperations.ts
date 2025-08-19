
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string, fullName?: string, phone?: string, farmName?: string, zone?: string) => {
    console.log('Attempting to sign up user:', email);
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Sign up successful:', data);
      setLoading(false);
      return { data, error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in user:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Sign in successful:', data);
      setLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    operationLoading: loading,
  };
};
