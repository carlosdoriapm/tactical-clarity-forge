import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AppRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing auth...');
    let unsubscribed = false;
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: Initial session check:', {
          hasSession: !!initialSession,
          userEmail: initialSession?.user?.email,
          error: error
        });
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
          toast({
            title: "Erro de autenticação",
            description: error.message || "Falha ao carregar sessão inicial...",
            variant: "destructive",
          });
        }
        if (initialSession && initialSession.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          console.log('AuthProvider: User authenticated:', initialSession.user.email);
        } else {
          console.log('AuthProvider: No authenticated user found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('AuthProvider: Error getting initial session:', error);
        toast({
          title: "Erro de autenticação",
          description: error instanceof Error ? error.message : "Erro desconhecido ao carregar sessão inicial.",
          variant: "destructive",
        });
        setSession(null);
        setUser(null);
      } finally {
        if (!unsubscribed) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state changed:', {
          event,
          hasSession: !!session,
          userEmail: session?.user?.email
        });
        setSession(session);
        setUser(session?.user ?? null);

        // Create user profile if it doesn't exist
        if (session?.user && event === 'SIGNED_IN') {
          // Removed await to prevent potential deadlocks as per Supabase best practices.
          createUserProfile(session.user);
        }
        
        setLoading(false);
      }
    );

    return () => {
      unsubscribed = true;
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const loadUserRoles = async (userId: string) => {
    try {
      // The 'user_roles' table is not yet in the auto-generated types from Supabase.
      // We cast the table name to `any` as a workaround until the types can be regenerated.
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        toast({
          title: "Erro ao carregar permissões",
          description: error.message,
          variant: "destructive",
        });
        setRoles([]);
        return;
      }
      
      const userRoles = (Array.isArray(data) ? data.map((r: { role: AppRole }) => r.role) : []) as AppRole[];
      const validRoles = userRoles.filter(Boolean);
      setRoles(validRoles);
      console.log('AuthProvider: User roles loaded:', validRoles);
    } catch (error) {
      console.error('Error in loadUserRoles:', error);
      setRoles([]);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      loadUserRoles(user.id);
    } else if (!user) {
      setRoles([]);
    }
  }, [user, loading]);

  const createUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id) // Check by ID for more reliability
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('users')
          .insert([{
            id: user.id, // Fix: Added user ID to the insert payload
            email: user.email,
            intensity_mode: 'TACTICAL',
            profile_complete: false,
            onboarding_completed: false
          }]);
        
        if (error) {
          console.error('Error creating user profile:', error);
        } else {
          console.log('User profile created successfully');
        }
      }
    } catch (error) {
      // Catching errors specifically for the case where .single() finds no rows
      if (error && (error as any).code === 'PGRST116') {
        // This is expected if the profile doesn't exist, so we can proceed with creation
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email,
            intensity_mode: 'TACTICAL',
            profile_complete: false,
            onboarding_completed: false
          }]);

        if (insertError) {
          console.error('Error creating user profile after initial check failed:', insertError);
        } else {
          console.log('User profile created successfully after initial check failed');
        }
      } else {
        console.error('Error in createUserProfile:', error);
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign up for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('AuthProvider: Sign up error:', error);
    } else {
      console.log('AuthProvider: Sign up successful');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('AuthProvider: Sign in error:', error);
    } else {
      console.log('AuthProvider: Sign in successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      console.log('AuthProvider: Sign out successful');
    }
  };

  const value = {
    user,
    session,
    loading,
    roles,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
