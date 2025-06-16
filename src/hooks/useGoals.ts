
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
      setGoals(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar metas: " + error.message,
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
      
      const newGoal = data as Goal;
      setGoals(prev => [newGoal, ...prev]);
      
      toast({
        title: "Meta criada",
        description: "Sua meta foi criada com sucesso!",
      });
      
      return newGoal;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao criar meta: " + error.message,
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
      
      const updatedGoal = data as Goal;
      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
      
      toast({
        title: "Meta atualizada",
        description: "Sua meta foi atualizada com sucesso!",
      });
      
      return updatedGoal;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar meta: " + error.message,
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
        title: "Meta removida",
        description: "Meta removida com sucesso!",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao remover meta: " + error.message,
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
