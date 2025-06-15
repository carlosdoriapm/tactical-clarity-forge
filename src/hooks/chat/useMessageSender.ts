
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import { Message } from '@/types/chat';

interface UseMessageSenderProps {
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: 'unknown' | 'testing' | 'good' | 'error') => void;
}

export function useMessageSender({ addMessage, setConnectionStatus }: UseMessageSenderProps) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

    addMessage(userMessage);
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
        addMessage(botErrorMessage);
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
        addMessage(botErrorMessage);
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
      addMessage(botMessage);

    } catch (criticalError) {
      console.error('💥 Chat: handleSend - Critical error during send process:', criticalError);
      setConnectionStatus('error');
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'A conexão com a sala de guerra foi cortada criticamente. Verifique sua conexão e tente novamente.',
        isBot: true,
        timestamp: new Date()
      };
      addMessage(botErrorMessage);
      sonnerToast.error("Falha Crítica na Conexão", { description: criticalError instanceof Error ? criticalError.message : "Erro desconhecido ao enviar mensagem." });
    } finally {
      setIsTyping(false);
      setIsSending(false);
      sonnerToast.dismiss("sending-message");
    }
  };

  return {
    inputValue,
    setInputValue,
    isTyping,
    isSending,
    handleSend
  };
}
