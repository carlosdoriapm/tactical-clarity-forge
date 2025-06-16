
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";

export function useConnection() {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');

  const testConnection = async () => {
    if (connectionStatus === 'testing') {
      console.log('⚠️ Test Connection: Already testing.');
      sonnerToast.info("Connection test already in progress.");
      return;
    }
    
    console.log('🔍 Chat: testConnection initiated...');
    sonnerToast.loading("Testing connection with the server...");
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'connection test',
          userId: user?.id || 'test-user-connection-test',
          isTest: true
        }
      });

      console.log('📨 Chat: testConnection - Response from Supabase function:', { data, error });

      if (error) {
        console.error('❌ Chat: testConnection - Supabase function invocation error:', error);
        setConnectionStatus('error');
        sonnerToast.error("Connection Test Failed", { description: `Error invoking function: ${error.message}`});
      } else if (data && data.success === false) {
        console.warn('⚠️ Chat: testConnection - Function returned success:false:', data);
        setConnectionStatus('error');
        sonnerToast.error("Connection Test Failed", { description: data.response || data.error || "The function returned an error."});
      } else if (data && data.success === true) {
        console.log('✅ Chat: testConnection - Successful.');
        setConnectionStatus('good');
        sonnerToast.success("Connection Established", { description: "The communication system is operational." });
      } else {
        console.error('❌ Chat: testConnection - Unexpected response structure:', data);
        setConnectionStatus('error');
        sonnerToast.warning("Inconclusive Connection Test", { description: "Unexpected response from test function." });
      }
    } catch (error) {
      console.error('💥 Chat: testConnection - Critical error during test:', error);
      setConnectionStatus('error');
      sonnerToast.error("Critical Connection Test Error", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };

  return {
    connectionStatus,
    setConnectionStatus,
    testConnection
  };
}
