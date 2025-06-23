
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  console.log('🎯 Chat component rendering...');
  const hasCreatedFirstConversation = useRef(false);

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

  // Create first conversation automatically
  useEffect(() => {
    if (conversations.length === 0 && 
        !currentConversation && 
        !hasCreatedFirstConversation.current) {
      
      console.log('🆕 Creating first conversation...');
      hasCreatedFirstConversation.current = true;
      createConversation('Strategic Session');
    }
  }, [conversations.length, currentConversation, createConversation]);

  return (
    <ChatContainer>
      <ChatInterface
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isTyping={isTyping}
        isSending={isSending}
        connectionStatus={connectionStatus}
        messagesEndRef={messagesEndRef}
        testConnection={testConnection}
        handleSend={handleSend}
        conversations={conversations}
        currentConversation={currentConversation}
        selectConversation={selectConversation}
        createConversation={createConversation}
      />
    </ChatContainer>
  );
};

export default Chat;
