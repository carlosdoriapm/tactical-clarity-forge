
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/types/conversation';

export const useGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Converter os dados do banco para o tipo Goal correto
      const convertedGoals: Goal[] = (data || []).map(goal => ({
        id: goal.id,
        user_id: goal.user_id,
        title: goal.title,
        description: goal.description,
        status: goal.status as 'active' | 'completed' | 'paused' | 'cancelled',
        priority: goal.priority as 'low' | 'medium' | 'high' | 'critical',
        target_date: goal.target_date,
        created_at: goal.created_at,
        updated_at: goal.updated_at,
        progress: goal.progress,
        metadata: goal.metadata
      }));
      
      setGoals(convertedGoals);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load goals: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goalData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      const newGoal: Goal = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        status: data.status as 'active' | 'completed' | 'paused' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        target_date: data.target_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
        progress: data.progress,
        metadata: data.metadata
      };
      
      setGoals(prev => [newGoal, ...prev]);
      
      toast({
        title: "Goal Created",
        description: "Your goal was successfully created!",
      });
      
      return newGoal;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create goal: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedGoal: Goal = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        status: data.status as 'active' | 'completed' | 'paused' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        target_date: data.target_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
        progress: data.progress,
        metadata: data.metadata
      };
      
      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
      
      toast({
        title: "Goal Updated",
        description: "Your goal was successfully updated!",
      });
      
      return updatedGoal;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update goal: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: "Goal removed",
        description: "Goal removed successfully!",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove goal: " + error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    loadGoals
  };
};
