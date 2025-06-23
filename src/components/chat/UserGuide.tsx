
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Target, Brain, Lightbulb, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideSteps = [
  {
    title: "Welcome to AlphaAdvisor",
    description: "Your strategic AI counselor for decision-making and goal achievement",
    icon: MessageSquare,
    content: [
      "AlphaAdvisor is designed to provide personalized strategic guidance",
      "Each conversation is saved automatically for continuity",
      "The AI adapts to your communication style over time",
      "Best suited for complex decisions and strategic planning"
    ],
    tip: "Start each session by clearly stating your current challenge or goal"
  },
  {
    title: "Starting Your First Conversation",
    description: "How to begin an effective strategic session",
    icon: Target,
    content: [
      "Click 'New Strategic Session' to start a fresh conversation",
      "Provide context about your situation or challenge",
      "Be specific about your goals and desired outcomes",
      "Share relevant background information upfront"
    ],
    tip: "Example: 'I need to decide between two job offers. Here's my situation...'"
  },
  {
    title: "Asking Effective Questions",
    description: "How to structure your queries for best results",
    icon: Brain,
    content: [
      "Be specific rather than vague in your questions",
      "Provide context and background information",
      "Ask for structured advice or step-by-step guidance",
      "Request pros and cons analysis for decisions"
    ],
    tip: "Instead of 'What should I do?' try 'Given X situation, what are the key factors I should consider?'"
  },
  {
    title: "Making the Most of Conversations",
    description: "Advanced techniques for strategic discussions",
    icon: Lightbulb,
    content: [
      "Break complex problems into smaller, manageable parts",
      "Ask for different perspectives on the same issue",
      "Request action plans with specific next steps",
      "Use follow-up questions to dive deeper into recommendations"
    ],
    tip: "Each conversation builds on previous context - reference earlier discussions for continuity"
  },
  {
    title: "Managing Your Sessions",
    description: "Organizing and tracking your strategic conversations",
    icon: MessageSquare,
    content: [
      "Each conversation is automatically saved with a timestamp",
      "Switch between different conversations using the sidebar",
      "Create new sessions for different topics or projects",
      "Previous conversations remain accessible for reference"
    ],
    tip: "Organize sessions by topic (e.g., 'Career Planning', 'Business Strategy', 'Personal Goals')"
  }
];

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentGuideStep = guideSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-warfare-dark border-warfare-blue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            How to Use AlphaAdvisor
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-warfare-red' : 'bg-warfare-blue/30'
                }`}
              />
            ))}
          </div>

          <Card className="bg-warfare-card border-warfare-blue/20 p-6">
            <div className="text-center mb-6">
              <currentGuideStep.icon className="w-16 h-16 text-warfare-red mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {currentGuideStep.title}
              </h3>
              <p className="text-warfare-blue">
                {currentGuideStep.description}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentGuideStep.content.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warfare-red rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white text-sm">{item}</p>
                </div>
              ))}
            </div>

            {currentGuideStep.tip && (
              <div className="bg-warfare-dark/50 border border-warfare-blue/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">Pro Tip</span>
                </div>
                <p className="text-warfare-blue text-sm">{currentGuideStep.tip}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="text-warfare-blue border-warfare-blue/30 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-warfare-gray text-sm">
            Step {currentStep + 1} of {guideSteps.length}
          </span>

          <Button
            onClick={handleNext}
            className="bg-warfare-red hover:bg-warfare-red/80"
          >
            {currentStep === guideSteps.length - 1 ? 'Start Chatting' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuide;
