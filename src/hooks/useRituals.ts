
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Ritual {
  id: string;
  name: string;
  duration_minutes: number;
  user_id: string;
  last_completed_at?: string;
  streak_count: number;
  stake_attached: boolean;
}

export const useRituals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRituals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('rituals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRituals(data || []);
    } catch (error) {
      console.error('Error loading rituals:', error);
      toast({
        title: "Error",
        description: "Failed to load rituals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRitual = async (ritualData: {
    name: string;
    duration_minutes: number;
    stake_attached?: boolean;
  }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('rituals')
        .insert([{
          user_id: user.id,
          name: ritualData.name,
          duration_minutes: ritualData.duration_minutes,
          stake_attached: ritualData.stake_attached || false,
          streak_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setRituals(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Ritual created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating ritual:', error);
      toast({
        title: "Error",
        description: "Failed to create ritual",
        variant: "destructive",
      });
    }
  };

  const completeRitual = async (ritualId: string) => {
    if (!user) return;
    
    try {
      const completionTime = new Date().toISOString();
      
      // Call the edge function to handle ritual completion
      const { data, error } = await supabase.functions.invoke('rituals', {
        method: 'PATCH',
        body: {
          ritual_id: ritualId,
          completed_at: completionTime
        }
      });

      if (error) throw error;

      // Update local state
      setRituals(prev => prev.map(ritual => 
        ritual.id === ritualId 
          ? { ...ritual, last_completed_at: completionTime, streak_count: (ritual.streak_count || 0) + 1 }
          : ritual
      ));

      toast({
        title: "Ritual Completed!",
        description: "Your streak has been updated",
      });

      return data;
    } catch (error) {
      console.error('Error completing ritual:', error);
      toast({
        title: "Error",
        description: "Failed to complete ritual",
        variant: "destructive",
      });
    }
  };

  const deleteRitual = async (ritualId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('rituals')
        .delete()
        .eq('id', ritualId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRituals(prev => prev.filter(ritual => ritual.id !== ritualId));
      
      toast({
        title: "Success",
        description: "Ritual deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting ritual:', error);
      toast({
        title: "Error",
        description: "Failed to delete ritual",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadRituals();
    }
  }, [user]);

  return {
    rituals,
    loading,
    createRitual,
    completeRitual,
    deleteRitual,
    loadRituals
  };
};
