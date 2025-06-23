
import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ConversationSidebar from './ConversationSidebar';
import UserGuide from './UserGuide';
import QuickStartTips from './QuickStartTips';

interface ChatInterfaceProps {
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
  const [showGuide, setShowGuide] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Show tips when there are no messages in current conversation
  const showTips = currentConversation && messages.length === 0;

  return (
    <div className="flex h-screen bg-warfare-dark">
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
        onShowGuide={() => setShowGuide(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader
          connectionStatus={connectionStatus}
          isSending={isSending}
          onTestConnection={testConnection}
          currentConversation={currentConversation}
          onShowGuide={() => setShowGuide(true)}
        />
        
        {showTips ? (
          <div className="flex-1 overflow-y-auto">
            <QuickStartTips />
          </div>
        ) : (
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        )}
        
        <ChatInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSend}
          onKeyDown={handleKeyDown}
          isTyping={isTyping}
          isSending={isSending}
        />
      </div>

      <UserGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
};

export default ChatInterface;
