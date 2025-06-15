
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

  const introSteps = [
    {
      title: 'Bem-vindo ao Chat Advisor',
      description: 'Seu conselheiro estratégico personalizado baseado no seu perfil psicológico.',
      icon: MessageSquare,
      content: userProfile?.disc_profile ? 
        `Detectei seu perfil DISC como ${userProfile.disc_profile.primaryType}. Vou adaptar minha comunicação ao seu estilo preferido.` :
        'Recomendo completar sua análise DISC para uma experiência mais personalizada.'
    },
    {
      title: 'Análise Personalizada',
      description: 'Baseado no seu perfil, posso oferecer conselhos mais assertivos.',
      icon: Brain,
      content: userProfile?.disc_profile ?
        `Como perfil ${userProfile.disc_profile.primaryType}, você responde melhor a: ${userProfile.disc_profile.communicationStyle}` :
        'Complete seu perfil para receber análises mais profundas.'
    },
    {
      title: 'Pronto para Começar',
      description: 'Vamos trabalhar juntos nos seus objetivos estratégicos.',
      icon: Target,
      content: userProfile?.mission_90_day ?
        `Sua missão atual: ${userProfile.mission_90_day}. Vamos focar nisso!` :
        'Defina sua missão principal para direcionarmos nossa conversa.'
    }
  ];

  const handleNext = () => {
    if (currentStep < introSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStart({
        discProfile: userProfile?.disc_profile,
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
          {currentStep === introSteps.length - 1 ? 'Começar Conversa' : 'Próximo'}
        </Button>
      </Card>
    </div>
  );
};

export default GuidedChatIntro;
