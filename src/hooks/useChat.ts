
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

  // Usar mensagens persistidas se há conversa atual, senão usar temporárias
  const currentMessages = currentConversation ? persistedMessages : tempMessages;

  console.log('💬 useChat state:', {
    hasConversation: !!currentConversation,
    messagesCount: currentMessages.length,
    conversationsCount: conversations.length,
    loading
  });

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
