
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('🛡️ Modo de teste: ProtectedRoute desabilitado - acesso livre');
  
  // No modo de teste, permitir acesso direto sem verificação
  return <>{children}</>;
};
