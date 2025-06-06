
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
}

const WarLogsDisplay = ({ warLogs, onWarLogsUpdate }: WarLogsDisplayProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);

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

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">War Logs</h2>
        <Button
          onClick={resetWarLogs}
          disabled={resetting || warLogs.length === 0}
          variant="destructive"
          size="sm"
        >
          {resetting ? 'Clearing...' : 'Reset War Logs'}
        </Button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {warLogs.length === 0 ? (
          <p className="text-warfare-blue">No missions logged yet. Start chatting to build your war logs.</p>
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
                    log.result === 'success' ? 'bg-green-500/20 text-green-400' :
                    log.result === 'fail' ? 'bg-red-500/20 text-red-400' :
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
              
              {log.commands && (
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
