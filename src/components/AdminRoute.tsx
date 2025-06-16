
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, roles } = useAuth();
  const location = useLocation();

  console.log('🛡️ AdminRoute state:', { 
    hasUser: !!user, 
    loading, 
    roles,
    currentPath: location.pathname 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
          <p className="text-white">Checking authentication and permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ AdminRoute: No user found, redirecting to auth...');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!roles.includes('admin')) {
    console.log('🛡️ AdminRoute: User is not an admin, redirecting to dashboard...');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🛡️ AdminRoute: Admin user authenticated, rendering admin content...');
  return <>{children}</>;
};
