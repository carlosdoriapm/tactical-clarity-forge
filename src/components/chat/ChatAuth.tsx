
import React from 'react';

interface ChatAuthProps {
  children: (user: any) => React.ReactNode;
}

const ChatAuth: React.FC<ChatAuthProps> = ({ children }) => {
  // Para testes, vamos criar um usuário mock em vez de verificar autenticação real
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com'
  };

  console.log('✅ Chat: Modo de teste ativo, usando usuário mock');
  return <>{children(mockUser)}</>;
};

export default ChatAuth;
