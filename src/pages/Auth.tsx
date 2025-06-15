
import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingFlow from '@/components/OnboardingFlow';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user needs onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user && !loading) {
        setIsCheckingOnboarding(true);
        
        try {
          // Check if user has completed onboarding
          const { data: userData } = await supabase
            .from('users')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();

          const { data: profileData } = await supabase
            .from('combatant_profile')
            .select('profile_complete')
            .eq('user_id', user.id)
            .single();

          const needsOnboarding = !userData?.onboarding_completed || !profileData?.profile_complete;
          
          if (needsOnboarding) {
            setShowOnboarding(true);
          } else {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // If error, assume needs onboarding for new users
          setShowOnboarding(true);
        } finally {
          setIsCheckingOnboarding(false);
        }
      }
    };

    checkOnboardingStatus();
  }, [user, loading, navigate, location]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  if (loading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  if (user && showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Redirect authenticated users who don't need onboarding
  if (user && !showOnboarding) {
    return null; // Will be redirected by useEffect
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
