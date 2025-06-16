
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatAuth from '@/components/chat/ChatAuth';
import ChatNotifications from '@/components/chat/ChatNotifications';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  console.log('🎯 Chat component rendering...');
  const hasCreatedFirstConversation = useRef(false);
  
  const { user, loading: authLoading } = useAuth();
  
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

  // Criar primeira conversa automaticamente se necessário
  useEffect(() => {
    if (user && 
        !loading && 
        conversations.length === 0 && 
        !currentConversation && 
        !hasCreatedFirstConversation.current) {
      
      console.log('🆕 Criando primeira conversa automaticamente...');
      hasCreatedFirstConversation.current = true;
      createConversation('Primeira Conversa');
    }
  }, [user, loading, conversations.length, currentConversation, createConversation]);

  return (
    <ChatContainer>
      <ChatNotifications 
        user={user} 
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
