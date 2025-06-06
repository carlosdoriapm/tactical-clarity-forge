
import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect authenticated users
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warfare-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">Warfare Counselor™</h1>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white"
            >
              Back to Home
            </Button>
          </header>

          {/* Auth Form */}
          <div className="glass-card p-8 rounded-xl">
            <AuthForm mode={mode} onModeChange={setMode} />
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-warfare-gray text-sm">
              By continuing, you agree to our tactical protocols and warfare guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
