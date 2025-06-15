
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth-context';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useUserRoles } from '@/hooks/auth/useUserRoles';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading } = useAuthState();
  const roles = useUserRoles(user, loading);
  const { signUp, signIn, signOut } = useAuthOperations();

  const value = {
    user,
    session,
    loading,
    roles,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
