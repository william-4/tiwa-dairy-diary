
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: 'admin' | 'worker' | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'worker' | null>(null);

  const fetchUserRole = async (userId: string) => {
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

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const role = await fetchUserRole(session.user.id);
            setUserRole(role as 'admin' | 'worker');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role as 'admin' | 'worker');
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
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
      return { error: null };
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
        setSession(null);
        setUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
