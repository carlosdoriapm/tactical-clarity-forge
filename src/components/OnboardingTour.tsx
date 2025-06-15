
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, MessageSquare, Target, LayoutDashboard, ArrowRight, Check } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    title: 'Dashboard de Performance',
    description: 'Monitore suas metas com gráficos intuitivos e motivadores. Veja seu progresso em tempo real.',
    icon: BarChart,
    features: ['Gráficos de progresso', 'Métricas de performance', 'Conquistas desbloqueadas']
  },
  {
    title: 'Decision Time-Machine',
    description: 'Visualize timelines para decisões complexas com IA. Antecipe consequências futuras.',
    icon: LayoutDashboard,
    features: ['Análise de cenários', 'Timeline de decisões', 'Previsões estratégicas']
  },
  {
    title: 'Chat Advisor',
    description: 'Converse com IA para conselhos estratégicos personalizados baseados no seu perfil DISC.',
    icon: MessageSquare,
    features: ['Conselhos personalizados', 'Análise DISC aplicada', 'Suporte 24/7']
  },
  {
    title: 'Tactical Dashboard',
    description: 'Dashboard completo de guerreiro com rituais e missões para transformação pessoal.',
    icon: Target,
    features: ['Rituais diários', 'Missões estratégicas', 'Controle de hábitos']
  }
];

const OnboardingTour = ({ onComplete, onSkip }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo ao Warfare Counselor™</h1>
        <p className="text-warfare-blue">Vamos fazer um tour rápido pelas funcionalidades principais</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-center space-x-2">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep ? 'bg-warfare-red' : 'bg-warfare-blue/30'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="bg-warfare-dark/90 border-warfare-blue/30 p-8 mb-8">
        <div className="text-center mb-6">
          <currentTourStep.icon className="w-16 h-16 text-warfare-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{currentTourStep.title}</h2>
          <p className="text-warfare-blue text-lg">{currentTourStep.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {currentTourStep.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 bg-warfare-dark/50 p-3 rounded-lg">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          onClick={onSkip}
          variant="outline"
          className="text-warfare-blue border-warfare-blue/30"
        >
          Pular Tour
        </Button>

        <div className="flex space-x-4">
          {currentStep > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="text-warfare-blue border-warfare-blue/30"
            >
              Anterior
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="bg-warfare-red hover:bg-warfare-red/80 flex items-center space-x-2"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Começar Jornada' : 'Próximo'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-warfare-gray text-sm">
          Etapa {currentStep + 1} de {tourSteps.length}
        </p>
      </div>
    </div>
  );
};

export default OnboardingTour;
