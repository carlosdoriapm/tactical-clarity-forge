
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import { Message } from '@/types/chat';
import { Conversation } from '@/types/conversation';

interface UseMessageSenderProps {
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: 'unknown' | 'testing' | 'good' | 'error') => void;
  saveMessage?: (conversationId: string, content: string, role: 'user' | 'assistant', metadata?: any) => Promise<any>;
  currentConversation?: Conversation | null;
}

export function useMessageSender({ addMessage, setConnectionStatus, saveMessage, currentConversation }: UseMessageSenderProps) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping || isSending) {
      console.log('⚠️ Chat: handleSend - Cannot send: empty message, bot typing, or message already sending.', { trimmedInput, isTyping, isSending });
      if (!trimmedInput) sonnerToast.warning("Empty message", { description: "Please type your query." });
      if (isTyping) sonnerToast.info("Hold on", { description: "The advisor is crafting a response." });
      if (isSending) sonnerToast.info("Sending", { description: "Your previous message is still being processed." });
      return;
    }

    console.log('🚀 Chat: handleSend - Sending message:', trimmedInput);
    sonnerToast.info("Sending your message...", { id: "sending-message" });
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

    // Save user message if we have persistence
    if (saveMessage && currentConversation) {
      await saveMessage(currentConversation.id, trimmedInput, 'user');
    }

    try {
      console.log('📡 Chat: handleSend - Calling edge function "ai-chat" with:', { message: trimmedInput, userId: user?.id });
      
      const { data, error: functionInvokeError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: trimmedInput,
          userId: user?.id || 'anonymous-chat-user',
          conversationId: currentConversation?.id
        }
      });
      sonnerToast.dismiss("sending-message");

      console.log('📨 Chat: handleSend - Response from "ai-chat":', { data, functionInvokeError });

      if (functionInvokeError) {
        console.error('❌ Chat: handleSend - Error invoking "ai-chat":', functionInvokeError);
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Failed to communicate with the advisor. Check your connection or try later.',
          isBot: true,
          timestamp: new Date()
        };
        addMessage(botErrorMessage);
        sonnerToast.error("Communication Error", { description: `Could not send your message: ${functionInvokeError.message}` });
        return;
      }

      if (!data) {
        console.error('❌ Chat: handleSend - No data received from "ai-chat".');
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'The advisor did not return a response. Please try again.',
          isBot: true,
          timestamp: new Date()
        };
        addMessage(botErrorMessage);
        sonnerToast.error("No Response Received", { description: "The 'ai-chat' function returned no data." });
        return;
      }

      let responseText = '';
      if (data.success === false || data.error) {
        console.warn('⚠️ Chat: handleSend - "ai-chat" returned success:false or an error property:', data);
        responseText = data.response || data.error || 'An error occurred while processing your request, warrior.';
        setConnectionStatus('error');
        sonnerToast.warning("Advisor Unavailable", { description: responseText });
      } else if (data.response) {
        console.log('✅ Chat: handleSend - "ai-chat" successful response.');
        responseText = data.response;
        setConnectionStatus('good');
        sonnerToast.success("Conselho Recebido");
      } else {
        console.warn('⚠️ Chat: handleSend - Unexpected response structure from "ai-chat":', data);
        responseText = 'I received an unexpected response from the advisor. Let me try to understand.';
        setConnectionStatus('error');
        sonnerToast.warning("Unexpected Response", { description: "The advisor's response format was not expected." });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        isBot: true,
        timestamp: new Date()
      };
      addMessage(botMessage);

      // Save bot message if we have persistence
      if (saveMessage && currentConversation) {
        await saveMessage(currentConversation.id, responseText, 'assistant', data);
      }

    } catch (criticalError) {
      console.error('💥 Chat: handleSend - Critical error during send process:', criticalError);
      setConnectionStatus('error');
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'The connection to the war room was critically cut. Check your connection and try again.',
        isBot: true,
        timestamp: new Date()
      };
      addMessage(botErrorMessage);
      sonnerToast.error("Critical Connection Failure", { description: criticalError instanceof Error ? criticalError.message : "Unknown error while sending message." });
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
