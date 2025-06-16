
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Decision } from '@/types/conversation';

export const useDecisions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDecisions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDecisions(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar decisões: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDecision = async (decisionData: Omit<Decision, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('decisions')
        .insert({
          ...decisionData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      const newDecision = data as Decision;
      setDecisions(prev => [newDecision, ...prev]);
      
      return newDecision;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao salvar decisão: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDecision = async (decisionId: string, updates: Partial<Decision>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('decisions')
        .update(updates)
        .eq('id', decisionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedDecision = data as Decision;
      setDecisions(prev => prev.map(decision => decision.id === decisionId ? updatedDecision : decision));
      
      return updatedDecision;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar decisão: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      loadDecisions();
    }
  }, [user]);

  return {
    decisions,
    loading,
    createDecision,
    updateDecision,
    loadDecisions
  };
};
