
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { WarLogForm } from './WarLogForm';
import { PlusCircle } from 'lucide-react';

interface WarLog {
  id: string;
  date: string;
  intensity?: string;
  result?: string;
  dilemma?: string;
  decision_path?: string;
  commands?: Record<string, any>;
  reflections?: string;
}

interface WarLogsDisplayProps {
  warLogs: WarLog[];
  onWarLogsUpdate: (logs: WarLog[]) => void;
  loadWarLogs: () => Promise<void>;
}

const WarLogsDisplay = ({ warLogs, onWarLogsUpdate, loadWarLogs }: WarLogsDisplayProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [showWarLogForm, setShowWarLogForm] = useState(false);

  const handleAddWarLog = async (logData: any) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('war_logs').insert([{
        ...logData,
        user_id: user.id
      }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "New mission logged.",
      });
      setShowWarLogForm(false);
      await loadWarLogs();
    } catch (err) {
      const error = err as Error;
      console.error("Error creating war log:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to log mission.",
        variant: "destructive",
      });
    }
  };

  const resetWarLogs = async () => {
    if (!user) return;
    
    try {
      setResetting(true);
      const { error } = await supabase
        .from('war_logs')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      onWarLogsUpdate([]);
      toast({
        title: "Success",
        description: "War logs cleared successfully",
      });
    } catch (error) {
      console.error('Error resetting war logs:', error);
      toast({
        title: "Error",
        description: "Failed to reset war logs",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };

  if (showWarLogForm) {
    return (
      <WarLogForm 
        onSubmit={handleAddWarLog}
        onCancel={() => setShowWarLogForm(false)}
      />
    )
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">War Logs</h2>
        <div className="flex items-center space-x-2">
            <Button onClick={() => setShowWarLogForm(true)} size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Log Mission
            </Button>
            <Button
              onClick={resetWarLogs}
              disabled={resetting || warLogs.length === 0}
              variant="destructive"
              size="sm"
            >
              {resetting ? 'Clearing...' : 'Reset War Logs'}
            </Button>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {warLogs.length === 0 ? (
          <p className="text-warfare-blue">No missions logged yet. Start by logging a new mission.</p>
        ) : (
          warLogs.map((log) => (
            <div key={log.id} className="bg-warfare-dark/50 p-4 rounded-lg border border-warfare-blue/30">
              <div className="text-xs text-warfare-blue mb-2">
                {new Date(log.date).toLocaleDateString()}
                {log.intensity && (
                  <span className="ml-2 px-2 py-1 bg-warfare-red/20 text-warfare-red rounded text-xs">
                    {log.intensity}
                  </span>
                )}
                {log.result && (
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    log.result === 'Success' ? 'bg-green-500/20 text-green-400' :
                    log.result === 'Fail' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {log.result}
                  </span>
                )}
              </div>
              
              {log.dilemma && (
                <div className="text-white text-sm mb-2">
                  <strong>Dilemma:</strong> {log.dilemma.substring(0, 100)}...
                </div>
              )}
              
              {log.decision_path && (
                <div className="text-warfare-blue text-sm mb-2">
                  <strong>Decision:</strong> {log.decision_path.substring(0, 100)}...
                </div>
              )}
              
              {log.commands && Object.keys(log.commands).length > 0 && (
                <div className="text-xs text-gray-400 mt-2">
                  <strong>Commands:</strong> {Object.keys(log.commands).join(', ')}
                </div>
              )}
              
              {log.reflections && (
                <div className="text-xs text-warfare-blue mt-2 italic">
                  "{log.reflections.substring(0, 80)}..."
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WarLogsDisplay;
