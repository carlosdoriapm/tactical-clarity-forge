
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import { Message } from '@/types/chat';

export function useChat() {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey—I'm AlphaAdvisor. First, I'll ask you a few questions so I can truly get to know you.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const testConnection = async () => {
    if (connectionStatus === 'testing' || isSending) {
      console.log('⚠️ Test Connection: Already testing or sending message.');
      sonnerToast.info("Teste de conexão já em progresso ou mensagem sendo enviada.");
      return;
    }
    console.log('🔍 Chat: testConnection initiated...');
    sonnerToast.loading("Testando conexão com o servidor...");
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'teste de conexão',
          userId: user?.id || 'test-user-connection-test',
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

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping || isSending) {
      console.log('⚠️ Chat: handleSend - Cannot send: empty message, bot typing, or message already sending.', { trimmedInput, isTyping, isSending });
      if (!trimmedInput) sonnerToast.warning("Mensagem vazia", { description: "Por favor, digite sua consulta." });
      if (isTyping) sonnerToast.info("Aguarde", { description: "O conselheiro está formulando uma resposta." });
      if (isSending) sonnerToast.info("Enviando", { description: "Sua mensagem anterior ainda está sendo processada." });
      return;
    }

    console.log('🚀 Chat: handleSend - Sending message:', trimmedInput);
    sonnerToast.info("Enviando sua mensagem...", { id: "sending-message" });
    setIsSending(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('📡 Chat: handleSend - Calling edge function "ai-chat" with:', { message: trimmedInput, userId: user?.id });
      
      const { data, error: functionInvokeError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: trimmedInput,
          userId: user?.id || 'anonymous-chat-user'
        }
      });
      sonnerToast.dismiss("sending-message");

      console.log('📨 Chat: handleSend - Response from "ai-chat":', { data, functionInvokeError });

      if (functionInvokeError) {
        console.error('❌ Chat: handleSend - Error invoking "ai-chat":', functionInvokeError);
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Falha ao comunicar com o conselheiro. Verifique sua conexão ou tente mais tarde.',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botErrorMessage]);
        sonnerToast.error("Erro de Comunicação", { description: `Não foi possível enviar sua mensagem: ${functionInvokeError.message}` });
        return;
      }

      if (!data) {
        console.error('❌ Chat: handleSend - No data received from "ai-chat".');
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'O conselheiro não retornou uma resposta. Tente novamente.',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botErrorMessage]);
        sonnerToast.error("Resposta Não Recebida", { description: "A função 'ai-chat' não retornou dados." });
        return;
      }

      let responseText = '';
      if (data.success === false || data.error) {
        console.warn('⚠️ Chat: handleSend - "ai-chat" returned success:false or an error property:', data);
        responseText = data.response || data.error || 'Ocorreu um erro ao processar sua solicitação, guerreiro.';
        setConnectionStatus('error');
        sonnerToast.warning("Conselheiro Indisponível", { description: responseText });
      } else if (data.response) {
        console.log('✅ Chat: handleSend - "ai-chat" successful response.');
        responseText = data.response;
        setConnectionStatus('good');
        sonnerToast.success("Conselho Recebido");
      } else {
        console.warn('⚠️ Chat: handleSend - Unexpected response structure from "ai-chat":', data);
        responseText = 'Recebi uma resposta inesperada do conselheiro. Deixe-me tentar entender.';
        setConnectionStatus('error');
        sonnerToast.warning("Resposta Inesperada", { description: "O formato da resposta do conselheiro não é o esperado." });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (criticalError) {
      console.error('💥 Chat: handleSend - Critical error during send process:', criticalError);
      setConnectionStatus('error');
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'A conexão com a sala de guerra foi cortada criticamente. Verifique sua conexão e tente novamente.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botErrorMessage]);
      sonnerToast.error("Falha Crítica na Conexão", { description: criticalError instanceof Error ? criticalError.message : "Erro desconhecido ao enviar mensagem." });
    } finally {
      setIsTyping(false);
      setIsSending(false);
      sonnerToast.dismiss("sending-message");
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isSending,
    connectionStatus,
    messagesEndRef,
    testConnection,
    handleSend
  };
}
