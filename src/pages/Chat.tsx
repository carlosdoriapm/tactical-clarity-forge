
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast as sonnerToast } from "sonner";
import { useNavigate } from 'react-router-dom';

import { useChat } from '@/hooks/useChat';
import AuthLoading from '@/components/chat/AuthLoading';
import LoginPrompt from '@/components/chat/LoginPrompt';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import DashboardButton from '@/components/chat/DashboardButton';

const Chat = () => {
  console.log('🎯 Chat component rendering/re-rendering...');
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isSending,
    connectionStatus,
    messagesEndRef,
    testConnection,
    handleSend
  } = useChat();

  useEffect(() => {
    console.log('🔍 Chat Auth State Updated:', { 
      user: user ? user.email : 'No user', 
      authLoading 
    });
    if (!authLoading && user) {
      sonnerToast.success("Autenticação verificada.", { description: `Usuário ${user.email} conectado.`});
    } else if (!authLoading && !user) {
      sonnerToast.error("Usuário não autenticado.", { description: "Redirecionando para login."});
    }
  }, [user, authLoading]);

  useEffect(() => {
    console.log('🔄 Chat Connection Status Updated:', connectionStatus);
  }, [connectionStatus]);

  if (authLoading) {
    console.log('⏳ Chat: Auth loading, showing loading screen...');
    return <AuthLoading />;
  }

  if (!user) {
    console.log('🔐 Chat: No user authenticated, showing login screen...');
    return <LoginPrompt onLoginClick={() => navigate('/auth')} />;
  }
  
  console.log('✅ Chat: User authenticated, rendering chat interface for', user?.email);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex flex-col">
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
    </div>
  );
};

export default Chat;
