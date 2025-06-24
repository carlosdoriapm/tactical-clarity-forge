
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DECISION_TEMPLATES } from '@/data/decision-templates';
import { DecisionTemplate } from '@/types/decision-framework';
import { Brain, Briefcase, User, TrendingUp, Users } from 'lucide-react';

interface DecisionTemplateSelectorProps {
  onSelectTemplate: (template: DecisionTemplate) => void;
  onSkip: () => void;
}

const categoryIcons = {
  career: Briefcase,
  business: TrendingUp,
  personal: User,
  investment: TrendingUp,
  leadership: Users
};

const DecisionTemplateSelector: React.FC<DecisionTemplateSelectorProps> = ({ 
  onSelectTemplate, 
  onSkip 
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <Brain className="w-12 h-12 text-warfare-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Strategic Decision Framework</h2>
        <p className="text-warfare-blue">Choose a template to guide your decision-making process</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {DECISION_TEMPLATES.map((template) => {
          const IconComponent = categoryIcons[template.category];
          return (
            <Card 
              key={template.id} 
              className="bg-warfare-card border-warfare-blue/20 p-4 hover:border-warfare-red/50 transition-colors cursor-pointer"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className="w-6 h-6 text-warfare-red mt-1" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                  <p className="text-warfare-blue text-sm mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-warfare-gray bg-warfare-dark px-2 py-1 rounded">
                      {template.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-warfare-blue">
                      {template.questions.length} guided questions
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={onSkip}
          variant="outline"
          className="text-warfare-blue border-warfare-blue/30 hover:bg-warfare-blue/10"
        >
          Skip Template - Free Form Discussion
        </Button>
      </div>
    </div>
  );
};

export default DecisionTemplateSelector;
