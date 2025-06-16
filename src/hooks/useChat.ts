
import { useMessages } from './chat/useMessages';
import { useConnection } from './chat/useConnection';
import { useMessageSender } from './chat/useMessageSender';
import { useConversations } from './useConversations';

export function useChat() {
  const { messages: tempMessages, messagesEndRef, addMessage, clearMessages } = useMessages();
  const { connectionStatus, setConnectionStatus, testConnection } = useConnection();
  const {
    conversations,
    currentConversation,
    messages: persistedMessages,
    createConversation,
    selectConversation,
    saveMessage,
    loading
  } = useConversations();
  
  const { inputValue, setInputValue, isTyping, isSending, handleSend } = useMessageSender({
    addMessage,
    setConnectionStatus,
    saveMessage,
    currentConversation
  });

  // Se temos uma conversa atual, usar mensagens persistidas; senão usar mensagens temporárias
  const currentMessages = currentConversation ? persistedMessages : tempMessages;

  return {
    messages: currentMessages,
    inputValue,
    setInputValue,
    isTyping,
    isSending,
    connectionStatus,
    messagesEndRef,
    testConnection,
    handleSend,
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    loading,
    clearMessages
  };
}
