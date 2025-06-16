
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { createUserProfile } from '@/utils/auth/userProfile';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
            title: "Authentication Error",
            description: error.message || "Failed to load initial session...",
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
          title: "Authentication Error",
          description: error instanceof Error ? error.message : "Unknown error loading initial session.",
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

  return { user, session, loading, setUser, setSession, setLoading };
}
