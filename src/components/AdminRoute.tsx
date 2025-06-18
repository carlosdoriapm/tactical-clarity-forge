
import React from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  console.log('🛡️ Modo de teste: AdminRoute desabilitado - acesso livre');
  
  // No modo de teste, permitir acesso direto sem verificação
  return <>{children}</>;
};
