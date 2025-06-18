
import React, { useState } from 'react';
import ProfileSetup from '@/components/ProfileSetup';
import DiscAssessment from '@/components/DiscAssessment';
import OnboardingTour from '@/components/OnboardingTour';
import { useToast } from '@/hooks/use-toast';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type OnboardingStep = 'profile' | 'disc' | 'tour' | 'complete';

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');
  const [profileData, setProfileData] = useState<any>(null);
  const [discProfile, setDiscProfile] = useState<any>(null);
  const { toast } = useToast();

  const handleProfileComplete = async (data: any) => {
    console.log('✅ Modo de teste: perfil salvo localmente', data);
    setProfileData(data);
    setCurrentStep('disc');
  };

  const handleDiscComplete = async (discData: any) => {
    console.log('✅ Modo de teste: DISC salvo localmente', discData);
    setDiscProfile(discData);
    setCurrentStep('tour');
  };

  const handleTourComplete = async () => {
    console.log('✅ Modo de teste: onboarding finalizado');
    setCurrentStep('complete');
    onComplete();
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
