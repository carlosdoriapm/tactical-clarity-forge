
import { useMessages } from './chat/useMessages';
import { useConnection } from './chat/useConnection';
import { useMessageSender } from './chat/useMessageSender';

export function useChat() {
  const { messages, messagesEndRef, addMessage } = useMessages();
  const { connectionStatus, setConnectionStatus, testConnection } = useConnection();
  const { inputValue, setInputValue, isTyping, isSending, handleSend } = useMessageSender({
    addMessage,
    setConnectionStatus
  });

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
