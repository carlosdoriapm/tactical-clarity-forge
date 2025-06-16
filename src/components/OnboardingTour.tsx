
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
    title: 'Performance Dashboard',
    description: 'Track your goals with intuitive and motivating charts. See your progress in real time.',
    icon: BarChart,
    features: ['Progress charts', 'Performance metrics', 'Unlocked achievements']
  },
  {
    title: 'Decision Time-Machine',
    description: 'Visualize timelines for complex decisions with AI and anticipate future consequences.',
    icon: LayoutDashboard,
    features: ['Scenario analysis', 'Decision timeline', 'Strategic forecasts']
  },
  {
    title: 'Chat Advisor',
    description: 'Chat with AI for strategic advice tailored to your DISC profile.',
    icon: MessageSquare,
    features: ['Personalized advice', 'DISC analysis applied', '24/7 support']
  },
  {
    title: 'Tactical Dashboard',
    description: 'Complete warrior dashboard with rituals and missions for personal transformation.',
    icon: Target,
    features: ['Daily rituals', 'Strategic missions', 'Habit tracking']
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
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Warfare Counselor™</h1>
        <p className="text-warfare-blue">Let's take a quick tour of the main features</p>
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
          Skip Tour
        </Button>

        <div className="flex space-x-4">
          {currentStep > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="text-warfare-blue border-warfare-blue/30"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="bg-warfare-red hover:bg-warfare-red/80 flex items-center space-x-2"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Start Journey' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-warfare-gray text-sm">
          Step {currentStep + 1} of {tourSteps.length}
        </p>
      </div>
    </div>
  );
};

export default OnboardingTour;
