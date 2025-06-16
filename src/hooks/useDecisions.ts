
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
      
      // Converter os dados do banco para o tipo Decision correto
      const convertedDecisions: Decision[] = (data || []).map(decision => ({
        id: decision.id,
        user_id: decision.user_id,
        conversation_id: decision.conversation_id,
        decision_text: decision.decision_text,
        analysis_result: decision.analysis_result,
        status: decision.status as 'pending' | 'implemented' | 'cancelled' | 'reviewing',
        created_at: decision.created_at,
        updated_at: decision.updated_at,
        implementation_date: decision.implementation_date,
        review_date: decision.review_date
      }));
      
      setDecisions(convertedDecisions);
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
      
      const newDecision: Decision = {
        id: data.id,
        user_id: data.user_id,
        conversation_id: data.conversation_id,
        decision_text: data.decision_text,
        analysis_result: data.analysis_result,
        status: data.status as 'pending' | 'implemented' | 'cancelled' | 'reviewing',
        created_at: data.created_at,
        updated_at: data.updated_at,
        implementation_date: data.implementation_date,
        review_date: data.review_date
      };
      
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
      
      const updatedDecision: Decision = {
        id: data.id,
        user_id: data.user_id,
        conversation_id: data.conversation_id,
        decision_text: data.decision_text,
        analysis_result: data.analysis_result,
        status: data.status as 'pending' | 'implemented' | 'cancelled' | 'reviewing',
        created_at: data.created_at,
        updated_at: data.updated_at,
        implementation_date: data.implementation_date,
        review_date: data.review_date
      };
      
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
