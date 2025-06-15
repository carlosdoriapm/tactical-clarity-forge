
import { supabase } from '@/integrations/supabase/client';

export function useAuthOperations() {
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

  return { signUp, signIn, signOut };
}
