
import React, { useState } from 'react';
import DecisionTemplateSelector from './DecisionTemplateSelector';
import StructuredDecisionChat from './StructuredDecisionChat';
import DecisionAnalysisResults from './DecisionAnalysisResults';
import { DecisionTemplate, DecisionAnalysis } from '@/types/decision-framework';

interface EnhancedDecisionInterfaceProps {
  onContinueToChat: (context?: any) => void;
}

type DecisionStep = 'template-selection' | 'structured-chat' | 'analysis-results' | 'free-chat';

const EnhancedDecisionInterface: React.FC<EnhancedDecisionInterfaceProps> = ({
  onContinueToChat
}) => {
  const [currentStep, setCurrentStep] = useState<DecisionStep>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<DecisionTemplate | null>(null);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);

  const handleTemplateSelect = (template: DecisionTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('structured-chat');
  };

  const handleSkipTemplate = () => {
    onContinueToChat();
  };

  const handleAnalysisComplete = (analysisResult: DecisionAnalysis) => {
    setAnalysis(analysisResult);
    setCurrentStep('analysis-results');
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setCurrentStep('template-selection');
  };

  const handleStartNewAnalysis = () => {
    setSelectedTemplate(null);
    setAnalysis(null);
    setCurrentStep('template-selection');
  };

  const handleContinueToChat = () => {
    const context = analysis ? {
      template: analysis.template,
      analysis: analysis,
      structured_input: analysis.userInput
    } : null;
    
    onContinueToChat(context);
  };

  switch (currentStep) {
    case 'template-selection':
      return (
        <DecisionTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onSkip={handleSkipTemplate}
        />
      );
    
    case 'structured-chat':
      return (
        <StructuredDecisionChat
          template={selectedTemplate!}
          onAnalysisComplete={handleAnalysisComplete}
          onBack={handleBackToTemplates}
        />
      );
    
    case 'analysis-results':
      return (
        <DecisionAnalysisResults
          analysis={analysis!}
          onStartNewAnalysis={handleStartNewAnalysis}
          onContinueChat={handleContinueToChat}
        />
      );
    
    default:
      return null;
  }
};

export default EnhancedDecisionInterface;
