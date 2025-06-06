
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WarLogEntry {
  id: string;
  date: string;
  dilemma: string;
  decision_path: string;
  commands: any;
  intensity: 'Low' | 'Medium' | 'High';
  result: string;
  reflections?: string;
}

export const useWarLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<WarLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWarLogs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('war_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedLogs: WarLogEntry[] = data?.map(log => ({
        id: log.id,
        date: log.date || new Date().toISOString(),
        dilemma: log.dilemma || '',
        decision_path: log.decision_path || '',
        commands: log.commands || {},
        intensity: (['Low', 'Medium', 'High'].includes(log.intensity) ? log.intensity : 'Medium') as 'Low' | 'Medium' | 'High',
        result: log.result || '',
        reflections: log.reflections || ''
      })) || [];

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error loading war logs:', error);
      toast({
        title: "Error",
        description: "Failed to load war logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWarLog = async (logData: Omit<WarLogEntry, 'id'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('war_logs')
        .insert([{
          user_id: user.id,
          date: logData.date,
          dilemma: logData.dilemma,
          decision_path: logData.decision_path,
          commands: logData.commands,
          intensity: logData.intensity,
          result: logData.result,
          reflections: logData.reflections
        }])
        .select()
        .single();

      if (error) throw error;

      const newLog: WarLogEntry = {
        id: data.id,
        date: data.date,
        dilemma: data.dilemma,
        decision_path: data.decision_path,
        commands: data.commands,
        intensity: (['Low', 'Medium', 'High'].includes(data.intensity) ? data.intensity : 'Medium') as 'Low' | 'Medium' | 'High',
        result: data.result,
        reflections: data.reflections
      };

      setLogs(prev => [newLog, ...prev]);
      
      toast({
        title: "Success",
        description: "War log entry created successfully",
      });

      return newLog;
    } catch (error) {
      console.error('Error creating war log:', error);
      toast({
        title: "Error",
        description: "Failed to create war log entry",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadWarLogs();
    }
  }, [user]);

  return {
    logs,
    loading,
    createWarLog,
    loadWarLogs
  };
};
