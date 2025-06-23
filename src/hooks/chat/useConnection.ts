
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";

export function useConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');

  const testConnection = async () => {
    if (connectionStatus === 'testing') {
      console.log('⚠️ Test Connection: Already testing.');
      sonnerToast.info("Connection test already in progress.");
      return;
    }
    
    console.log('🔍 Chat: testConnection initiated...');
    sonnerToast.loading("Testing connection to server...");
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'connection test',
          userId: 'test-user-connection-test',
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
        sonnerToast.error("Connection Test Failed", { description: data.response || data.error || "Function returned an error."});
      } else if (data && data.success === true) {
        console.log('✅ Chat: testConnection - Successful.');
        setConnectionStatus('good');
        sonnerToast.success("Connection Established", { description: "Communication system is operational." });
      } else {
        console.error('❌ Chat: testConnection - Unexpected response structure:', data);
        setConnectionStatus('error');
        sonnerToast.warning("Connection Test Inconclusive", { description: "Unexpected response from test function." });
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
