
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthLoading from './AuthLoading';
import LoginPrompt from './LoginPrompt';

interface ChatAuthProps {
  children: (user: any) => React.ReactNode;
}

const ChatAuth: React.FC<ChatAuthProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    console.log('⏳ Chat: Auth loading, showing loading screen...');
    return <AuthLoading />;
  }

  if (!user) {
    console.log('🔐 Chat: No user authenticated, showing login screen...');
    return <LoginPrompt onLoginClick={() => navigate('/auth')} />;
  }

  console.log('✅ Chat: User authenticated, rendering chat interface for', user?.email);
  return <>{children(user)}</>;
};

export default ChatAuth;
