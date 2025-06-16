
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Brain, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GuidedChatIntroProps {
  onStart: (introData: any) => void;
}

const GuidedChatIntro = ({ onStart }: GuidedChatIntroProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('combatant_profile')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserProfile(data);
      }
    };

    loadUserProfile();
  }, [user]);

  const discProfile = userProfile?.metadata?.disc_profile;

  const introSteps = [
    {
      title: 'Welcome to Chat Advisor',
      description: 'Your strategic advisor tailored to your psychological profile.',
      icon: MessageSquare,
      content: discProfile ?
        `I detected your DISC profile as ${discProfile.primaryType}. I will adapt my communication to your preferred style.` :
        'I recommend completing your DISC assessment for a more personalized experience.'
    },
    {
      title: 'Personalized Analysis',
      description: 'Based on your profile, I can offer more assertive advice.',
      icon: Brain,
      content: discProfile ?
        `As a ${discProfile.primaryType} type, you respond best to: ${discProfile.communicationStyle}` :
        'Complete your profile to receive deeper analysis.'
    },
    {
      title: 'Ready to Start',
      description: 'Let\'s work together on your strategic goals.',
      icon: Target,
      content: userProfile?.mission_90_day ?
        `Your current mission: ${userProfile.mission_90_day}. Let\'s focus on that!` :
        'Set your main mission so we can guide our conversation.'
    }
  ];

  const handleNext = () => {
    if (currentStep < introSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStart({
        discProfile: discProfile,
        mission: userProfile?.mission_90_day,
        intensityMode: userProfile?.intensity_mode
      });
    }
  };

  const currentIntroStep = introSteps[currentStep];

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="bg-warfare-dark/90 border-warfare-blue/30 p-6 text-center">
        <currentIntroStep.icon className="w-16 h-16 text-warfare-red mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">{currentIntroStep.title}</h3>
        <p className="text-warfare-blue mb-4">{currentIntroStep.description}</p>
        <div className="bg-warfare-dark/50 p-4 rounded-lg mb-6">
          <p className="text-white text-sm">{currentIntroStep.content}</p>
        </div>
        
        <div className="flex justify-center space-x-2 mb-4">
          {introSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-warfare-red' : 'bg-warfare-blue/30'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full bg-warfare-red hover:bg-warfare-red/80"
        >
          {currentStep === introSteps.length - 1 ? 'Start Chat' : 'Next'}
        </Button>
      </Card>
    </div>
  );
};

export default GuidedChatIntro;
