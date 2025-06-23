
import { useState } from 'react';
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
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping || isSending) {
      console.log('⚠️ Chat: handleSend - Cannot send message', { trimmedInput, isTyping, isSending });
      if (!trimmedInput) sonnerToast.warning("Empty message", { description: "Please type your message." });
      if (isTyping) sonnerToast.info("Please wait", { description: "The advisor is formulating a response." });
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
      console.log('📡 Chat: handleSend - Calling edge function "ai-chat"');
      
      const { data, error: functionInvokeError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: trimmedInput,
          userId: 'default-user',
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
          content: 'Communication failure with the war room. Check your connection and try again.',
          isBot: true,
          timestamp: new Date()
        };
        addMessage(botErrorMessage);
        sonnerToast.error("Communication Error", { description: `Failed to send message: ${functionInvokeError.message}` });
        return;
      }

      if (!data) {
        console.error('❌ Chat: handleSend - No data received from "ai-chat".');
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'The advisor did not respond. Try again.',
          isBot: true,
          timestamp: new Date()
        };
        addMessage(botErrorMessage);
        sonnerToast.error("No Response", { description: "The 'ai-chat' function returned no data." });
        return;
      }

      let responseText = '';
      if (data.success === false || data.error) {
        console.warn('⚠️ Chat: handleSend - "ai-chat" returned error:', data);
        responseText = data.response || data.error || 'An error occurred processing your request, warrior.';
        setConnectionStatus('error');
        sonnerToast.warning("Advisor Unavailable", { description: responseText });
      } else if (data.response) {
        console.log('✅ Chat: handleSend - "ai-chat" successful response.');
        responseText = data.response;
        setConnectionStatus('good');
        sonnerToast.success("Strategic Counsel Received");
      } else {
        console.warn('⚠️ Chat: handleSend - Unexpected response structure:', data);
        responseText = 'Received an unexpected response from the advisor. Let me try to understand.';
        setConnectionStatus('error');
        sonnerToast.warning("Unexpected Response", { description: "The advisor's response format was unexpected." });
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
      console.error('💥 Chat: handleSend - Critical error:', criticalError);
      setConnectionStatus('error');
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Critical connection failure with the war room. Check your connection and try again.',
        isBot: true,
        timestamp: new Date()
      };
      addMessage(botErrorMessage);
      sonnerToast.error("Critical Connection Failure", { description: criticalError instanceof Error ? criticalError.message : "Unknown error sending message." });
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
