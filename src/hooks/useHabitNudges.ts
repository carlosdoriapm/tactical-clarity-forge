
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HabitNudge {
  id: string;
  habit_id: string;
  text: string;
  missed_days: number;
  created_at: string;
}

export function useHabitNudges() {
  const { user } = useAuth();
  const [nudges, setNudges] = useState<HabitNudge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNudges = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('habit_nudges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (fetchError) {
        throw fetchError;
      }

      setNudges(data || []);
    } catch (err) {
      console.error('Error fetching habit nudges:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nudges');
    } finally {
      setLoading(false);
    }
  };

  const generateNudge = async (params: {
    user_first_name: string;
    habit_name: string;
    missed_days: number;
    last_success_date: string;
    habit_id: string;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('hdd_nudge', {
        body: {
          ...params,
          user_id: user.id
        }
      });

      if (invokeError) {
        throw invokeError;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate nudge');
      }

      // Refresh nudges list
      await fetchNudges();

      return data.nudge;
    } catch (err) {
      console.error('Error generating nudge:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate nudge');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNudges();
  }, [user]);

  return {
    nudges,
    loading,
    error,
    generateNudge,
    refreshNudges: fetchNudges
  };
}
