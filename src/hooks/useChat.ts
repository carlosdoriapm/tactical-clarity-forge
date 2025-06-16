
import { useMessages } from './chat/useMessages';
import { useConnection } from './chat/useConnection';
import { useMessageSender } from './chat/useMessageSender';
import { useConversations } from './useConversations';

export function useChat() {
  const { messages, messagesEndRef, addMessage } = useMessages();
  const { connectionStatus, setConnectionStatus, testConnection } = useConnection();
  const {
    conversations,
    currentConversation,
    messages: persistedMessages,
    createConversation,
    selectConversation,
    saveMessage
  } = useConversations();
  
  const { inputValue, setInputValue, isTyping, isSending, handleSend } = useMessageSender({
    addMessage,
    setConnectionStatus,
    saveMessage,
    currentConversation
  });

  return {
    messages: currentConversation ? persistedMessages : messages,
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
    selectConversation
  };
}
