
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AppRole } from '@/types/auth';

export function useUserRoles(user: User | null, loading: boolean) {
  const [roles, setRoles] = useState<AppRole[]>([]);

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
      
      if (Array.isArray(data)) {
        // Since types are not auto-generated for user_roles, we treat `r` as any
        const userRoles = data.map((r: any) => r.role);
        const validRoles = userRoles.filter(Boolean) as AppRole[];
        setRoles(validRoles);
        console.log('AuthProvider: User roles loaded:', validRoles);
      } else {
        setRoles([]);
      }
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

  return roles;
}
