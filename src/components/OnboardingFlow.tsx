
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSetup from '@/components/ProfileSetup';
import DiscAssessment from '@/components/DiscAssessment';
import OnboardingTour from '@/components/OnboardingTour';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type OnboardingStep = 'profile' | 'disc' | 'tour' | 'complete';

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');
  const [profileData, setProfileData] = useState<any>(null);
  const [discProfile, setDiscProfile] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleProfileComplete = async (data: any) => {
    setProfileData(data);
    
    // Save profile to database
    try {
      const { error } = await supabase
        .from('combatant_profile')
        .upsert({
          ...data,
          user_id: user?.id,
          profile_complete: true
        });

      if (error) throw error;
      
      setCurrentStep('disc');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao salvar perfil: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDiscComplete = async (discData: any) => {
    setDiscProfile(discData);
    
    // Update profile with DISC data
    try {
      const { error } = await supabase
        .from('combatant_profile')
        .update({
          disc_profile: discData,
          onboarding_completed: true
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setCurrentStep('tour');
    } catch (error: any) {
      toast({
        title: "Erro", 
        description: "Falha ao salvar análise DISC: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleTourComplete = async () => {
    // Mark onboarding as completed
    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user?.id);

      if (error) throw error;
      
      setCurrentStep('complete');
      onComplete();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao finalizar onboarding: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    if (currentStep === 'profile') {
      setCurrentStep('disc');
    } else if (currentStep === 'disc') {
      setCurrentStep('tour');
    } else if (currentStep === 'tour') {
      handleTourComplete();
    }
  };

  return (
    <div className="min-h-screen bg-warfare-dark flex items-center justify-center p-4">
      {currentStep === 'profile' && (
        <ProfileSetup 
          onComplete={handleProfileComplete}
          onSkip={handleSkip}
        />
      )}
      
      {currentStep === 'disc' && (
        <DiscAssessment 
          onComplete={handleDiscComplete}
          onSkip={handleSkip}
        />
      )}
      
      {currentStep === 'tour' && (
        <OnboardingTour 
          onComplete={handleTourComplete}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
};

export default OnboardingFlow;
