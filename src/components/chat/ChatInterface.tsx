
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ConversationSidebar from './ConversationSidebar';

interface ChatInterfaceProps {
  user: any;
  messages: any[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isTyping: boolean;
  isSending: boolean;
  connectionStatus: 'unknown' | 'testing' | 'good' | 'error';
  messagesEndRef: React.RefObject<HTMLDivElement>;
  testConnection: () => void;
  handleSend: () => void;
  conversations: any[];
  currentConversation: any;
  selectConversation: (conversation: any) => void;
  createConversation: (title?: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
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
  selectConversation,
  createConversation
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-warfare-dark">
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader
          user={user}
          connectionStatus={connectionStatus}
          isSending={isSending}
          onTestConnection={testConnection}
          currentConversation={currentConversation}
        />
        <MessageList
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSend}
          onKeyDown={handleKeyDown}
          isTyping={isTyping}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
