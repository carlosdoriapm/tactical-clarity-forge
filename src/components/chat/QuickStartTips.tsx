
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare, Target, Brain, Lightbulb } from 'lucide-react';

const quickTips = [
  {
    icon: MessageSquare,
    title: "Be Specific",
    description: "Provide clear context and specific details about your situation"
  },
  {
    icon: Target,
    title: "Set Clear Goals",
    description: "Define what outcome you're hoping to achieve from the conversation"
  },
  {
    icon: Brain,
    title: "Ask for Structure",
    description: "Request step-by-step plans, pros/cons lists, or structured analysis"
  },
  {
    icon: Lightbulb,
    title: "Follow Up",
    description: "Ask clarifying questions and dive deeper into recommendations"
  }
];

const QuickStartTips: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Quick Start Tips</h2>
        <p className="text-warfare-blue">Get the most out of your strategic sessions</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickTips.map((tip, index) => (
          <Card key={index} className="bg-warfare-card border-warfare-blue/20 p-4 text-center">
            <tip.icon className="w-8 h-8 text-warfare-red mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
            <p className="text-warfare-blue text-sm">{tip.description}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-warfare-dark/50 border-warfare-blue/20 p-6 mt-6">
        <h3 className="text-white font-bold mb-3">Example Opening Messages:</h3>
        <div className="space-y-3">
          <div className="bg-warfare-card p-3 rounded border-l-4 border-warfare-red">
            <p className="text-white text-sm">
              "I'm considering a career change from marketing to product management. I have 5 years of experience, and I'm weighing the risks vs opportunities. Can you help me analyze this decision?"
            </p>
          </div>
          <div className="bg-warfare-card p-3 rounded border-l-4 border-warfare-blue">
            <p className="text-white text-sm">
              "I need to improve my team's productivity. We're missing deadlines and communication is poor. What's a structured approach to address these issues?"
            </p>
          </div>
          <div className="bg-warfare-card p-3 rounded border-l-4 border-green-500">
            <p className="text-white text-sm">
              "I want to start a side business while keeping my day job. Can you create a step-by-step plan for balancing both without burning out?"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickStartTips;
