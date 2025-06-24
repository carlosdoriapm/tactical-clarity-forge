
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DecisionTemplate, DecisionAnalysis } from '@/types/decision-framework';
import { PERSPECTIVE_TEMPLATES } from '@/data/decision-templates';
import { CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';

interface StructuredDecisionChatProps {
  template: DecisionTemplate;
  onAnalysisComplete: (analysis: DecisionAnalysis) => void;
  onBack: () => void;
}

const StructuredDecisionChat: React.FC<StructuredDecisionChatProps> = ({
  template,
  onAnalysisComplete,
  onBack
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      const newAnswers = [...answers, currentAnswer.trim()];
      setAnswers(newAnswers);
      setCurrentAnswer('');
      
      if (currentQuestion < template.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // All questions answered, generate analysis
        generateAnalysis(newAnswers);
      }
    }
  };

  const generateAnalysis = async (allAnswers: string[]) => {
    setIsAnalyzing(true);
    
    // Simulate analysis generation (in real implementation, this would call the AI)
    setTimeout(() => {
      const analysis: DecisionAnalysis = {
        template,
        userInput: allAnswers.join('\n\n'),
        perspectives: PERSPECTIVE_TEMPLATES[template.id as keyof typeof PERSPECTIVE_TEMPLATES]?.map((perspective, index) => ({
          perspective: perspective.split(':')[0],
          viewpoint: perspective.split(':')[1],
          considerations: [`Consideration ${index + 1}`, `Factor ${index + 1}`],
          risks: [`Risk ${index + 1}`],
          opportunities: [`Opportunity ${index + 1}`]
        })) || [],
        framework_analysis: {
          type: template.framework.type,
          results: 'Generated framework analysis would go here'
        },
        recommendations: [
          'Primary recommendation based on analysis',
          'Alternative approach to consider',
          'Risk mitigation strategy'
        ],
        next_steps: [
          'Immediate action item',
          'Research requirement',
          'Timeline milestone'
        ],
        bias_warnings: [
          'Potential confirmation bias detected',
          'Consider seeking external perspectives'
        ]
      };
      
      onAnalysisComplete(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-warfare-red border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Decision</h3>
        <p className="text-warfare-blue">Generating multi-perspective analysis and strategic recommendations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="outline" size="sm">
            ← Back to Templates
          </Button>
          <span className="text-warfare-gray text-sm">
            Question {currentQuestion + 1} of {template.questions.length}
          </span>
        </div>
        
        <div className="w-full bg-warfare-dark rounded-full h-2 mb-4">
          <div 
            className="bg-warfare-red h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / template.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="bg-warfare-card border-warfare-blue/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">{template.name}</h3>
        
        <div className="mb-6">
          <h4 className="text-warfare-blue font-semibold mb-2">
            {template.questions[currentQuestion]}
          </h4>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full bg-warfare-dark text-white p-3 rounded border border-warfare-blue/30 focus:border-warfare-red focus:outline-none min-h-[120px]"
            placeholder="Provide detailed information to get better strategic analysis..."
          />
        </div>

        {answers.length > 0 && (
          <div className="mb-6">
            <h5 className="text-warfare-gray text-sm mb-2">Previous Answers:</h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {answers.map((answer, index) => (
                <div key={index} className="text-xs text-warfare-blue bg-warfare-dark/50 p-2 rounded">
                  <strong>Q{index + 1}:</strong> {answer.substring(0, 100)}...
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleNextQuestion}
          disabled={!currentAnswer.trim()}
          className="w-full bg-warfare-red hover:bg-warfare-red/80"
        >
          {currentQuestion < template.questions.length - 1 ? 'Next Question' : 'Generate Analysis'}
        </Button>
      </Card>
    </div>
  );
};

export default StructuredDecisionChat;
