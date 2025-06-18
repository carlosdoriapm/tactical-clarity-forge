
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatAuth from '@/components/chat/ChatAuth';
import ChatNotifications from '@/components/chat/ChatNotifications';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  console.log('🎯 Chat component rendering in test mode...');
  const hasCreatedFirstConversation = useRef(false);
  
  // Para modo de teste, não precisamos de autenticação real
  const mockUser = { id: 'test-user-id', email: 'test@example.com' };
  const authLoading = false;
  
  const {
    messages,
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
    loading
  } = useChat();

  // Criar primeira conversa automaticamente para modo de teste
  useEffect(() => {
    if (conversations.length === 0 && 
        !currentConversation && 
        !hasCreatedFirstConversation.current) {
      
      console.log('🆕 Criando primeira conversa automaticamente para teste...');
      hasCreatedFirstConversation.current = true;
      createConversation('Conversa de Teste');
    }
  }, [conversations.length, currentConversation, createConversation]);

  return (
    <ChatContainer>
      <ChatNotifications 
        user={mockUser} 
        authLoading={authLoading} 
        connectionStatus={connectionStatus} 
      />
      
      <ChatAuth>
        {(authenticatedUser) => (
          <ChatInterface
            user={authenticatedUser}
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isTyping={isTyping}
            isSending={isSending}
            connectionStatus={connectionStatus}
            messagesEndRef={messagesEndRef}
            testConnection={testConnection}
            handleSend={handleSend}
          />
        )}
      </ChatAuth>
    </ChatContainer>
  );
};

export default Chat;
