
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('🛡️ ProtectedRoute: Checking authentication...');
  
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute state:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    loading, 
    currentPath: location.pathname 
  });

  if (loading) {
    console.log('🛡️ ProtectedRoute: Still loading auth state...');
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute: No user found, redirecting to auth...');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('🛡️ ProtectedRoute: User authenticated, rendering protected content...');
  return <>{children}</>;
};
