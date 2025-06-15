
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import DashboardButton from './DashboardButton';

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
  handleSend
}) => {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <DashboardButton onClick={() => navigate('/')} />
      
      <ChatHeader
        user={user}
        connectionStatus={connectionStatus}
        isSending={isSending}
        onTestConnection={testConnection}
        onNavigateToDashboard={() => navigate('/dashboard')}
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
    </>
  );
};

export default ChatInterface;
