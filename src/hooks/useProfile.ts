import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CombatantProfileData } from '@/types/profile';

interface WarLog {
  id: string;
  date: string;
  intensity?: string;
  result?: string;
  dilemma?: string;
  decision_path?: string;
  commands?: any;
  reflections?: string;
}

export const useProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<CombatantProfileData>>({});
  const [warLogs, setWarLogs] = useState<WarLog[]>([]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data: combatantProfile } = await supabase
        .from('combatant_profile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (combatantProfile) {
        setProfile(combatantProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load combatant profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWarLogs = async () => {
    if (!user) return;
    
    try {
      const { data: logs } = await supabase
        .from('war_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      if (logs) {
        const formattedLogs: WarLog[] = logs.map(log => ({
          id: log.id,
          date: log.date,
          intensity: log.intensity || undefined,
          result: log.result || undefined,
          dilemma: log.dilemma || undefined,
          decision_path: log.decision_path || undefined,
          commands: log.commands || undefined,
          reflections: log.reflections || undefined
        }));
        setWarLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Error loading war logs:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
      loadWarLogs();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    setProfile,
    warLogs,
    setWarLogs,
    loading,
    loadProfile,
    loadWarLogs
  };
};
