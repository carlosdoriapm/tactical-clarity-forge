
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  email: string;
  age: string;
  intensity_mode: 'TACTICAL' | 'RUTHLESS' | 'LEGION';
  domain_focus: 'corpo' | 'dinheiro' | 'influencia' | '';
  current_mission: string;
  profile_complete: boolean;
}

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
  const [profile, setProfile] = useState<ProfileData>({
    email: '',
    age: '',
    intensity_mode: 'TACTICAL',
    domain_focus: '',
    current_mission: '',
    profile_complete: false
  });
  const [warLogs, setWarLogs] = useState<WarLog[]>([]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (userProfile) {
        setProfile({
          email: userProfile.email,
          age: '', // Age field doesn't exist in the database schema
          intensity_mode: (userProfile.intensity_mode as 'TACTICAL' | 'RUTHLESS' | 'LEGION') || 'TACTICAL',
          domain_focus: (userProfile.domain_focus as 'corpo' | 'dinheiro' | 'influencia' | '') || '',
          current_mission: userProfile.current_mission || '',
          profile_complete: userProfile.profile_complete || false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
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
