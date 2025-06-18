
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";

export function useConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');

  const testConnection = async () => {
    if (connectionStatus === 'testing') {
      console.log('⚠️ Test Connection: Already testing.');
      sonnerToast.info("Teste de conexão já em progresso.");
      return;
    }
    
    console.log('🔍 Chat: testConnection initiated...');
    sonnerToast.loading("Testando conexão com o servidor...");
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'teste de conexão',
          userId: 'test-user-connection-test',
          isTest: true
        }
      });

      console.log('📨 Chat: testConnection - Response from Supabase function:', { data, error });

      if (error) {
        console.error('❌ Chat: testConnection - Supabase function invocation error:', error);
        setConnectionStatus('error');
        sonnerToast.error("Teste de Conexão Falhou", { description: `Erro ao invocar função: ${error.message}`});
      } else if (data && data.success === false) {
        console.warn('⚠️ Chat: testConnection - Function returned success:false:', data);
        setConnectionStatus('error');
        sonnerToast.error("Teste de Conexão Falhou", { description: data.response || data.error || "A função retornou um erro."});
      } else if (data && data.success === true) {
        console.log('✅ Chat: testConnection - Successful.');
        setConnectionStatus('good');
        sonnerToast.success("Conexão Estabelecida", { description: "O sistema de comunicação está operacional." });
      } else {
        console.error('❌ Chat: testConnection - Unexpected response structure:', data);
        setConnectionStatus('error');
        sonnerToast.warning("Teste de Conexão Inconclusivo", { description: "Resposta inesperada da função de teste." });
      }
    } catch (error) {
      console.error('💥 Chat: testConnection - Critical error during test:', error);
      setConnectionStatus('error');
      sonnerToast.error("Erro Crítico no Teste de Conexão", { description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido." });
    }
  };

  return {
    connectionStatus,
    setConnectionStatus,
    testConnection
  };
}
