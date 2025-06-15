import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BackToDashboard } from '@/components/BackToDashboard';
import { useTranslation } from '@/hooks/useTranslation';

type State = 'idle' | 'loading' | 'success' | 'error';

interface Decision {
  id: string;
  title: string;
  description: string;
  options: string[];
  consequences: string[];
  timestamp: Date;
}

const TimeMachineDemo = () => {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentState, setCurrentState] = useState<State>('idle');

  const { data: analysisData, status } = useQuery({
    queryKey: ['tactical-analysis', decision?.id],
    queryFn: async () => {
      if (!decision) return null;
      
      const { data, error } = await supabase.functions.invoke('tactical-analysis', {
        body: {
          decision: decision.title,
          context: decision.description,
          options: decision.options
        }
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!decision
  });

  React.useEffect(() => {
    console.log('[TimeMachine] status:', status);
  }, [status]);

  const handleDecisionSubmit = (newDecision: Decision) => {
    setDecision(newDecision);
    setCurrentState('loading');
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setCurrentState('success');
  };

  const resetMachine = () => {
    setDecision(null);
    setSelectedOption(null);
    setCurrentState('idle');
  };

  const getStatusDisplay = () => {
    if (status === 'pending') return 'Analyzing...';
    if (status === 'error') return 'Analysis Failed';
    if (status === 'success') return 'Analysis Complete';
    return 'Ready';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark p-6">
      <div className="max-w-4xl mx-auto">
        <BackToDashboard />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('decision_tm')}</h1>
          <p className="text-warfare-gray">Analyze decisions through time and consequence</p>
        </header>

        <div className="glass-card p-6 rounded-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Status: {getStatusDisplay()}</h2>
            {status === 'pending' && (
              <div className="w-full bg-warfare-gray/20 rounded-full h-2">
                <div className="bg-warfare-blue h-2 rounded-full animate-pulse w-1/2"></div>
              </div>
            )}
          </div>

          {currentState === 'idle' && (
            <div className="text-center">
              <p className="text-warfare-gray mb-4">
                Enter a decision you're facing to see potential outcomes
              </p>
              <button
                onClick={() => {
                  const mockDecision: Decision = {
                    id: '1',
                    title: 'Career Change',
                    description: 'Considering switching from corporate job to freelancing',
                    options: ['Stay in corporate', 'Go freelance', 'Hybrid approach'],
                    consequences: ['Stability vs Growth', 'Security vs Freedom', 'Balance vs Focus'],
                    timestamp: new Date()
                  };
                  handleDecisionSubmit(mockDecision);
                }}
                className="bg-warfare-blue hover:bg-warfare-blue/80 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Start Analysis
              </button>
            </div>
          )}

          {currentState === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
              <p className="text-white">Analyzing decision pathways...</p>
            </div>
          )}

          {currentState === 'success' && decision && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{decision.title}</h3>
              <p className="text-warfare-gray mb-6">{decision.description}</p>
              
              <div className="grid gap-4 mb-6">
                {decision.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`p-4 rounded-lg border transition-colors text-left ${
                      selectedOption === index
                        ? 'border-warfare-red bg-warfare-red/10 text-white'
                        : 'border-warfare-gray/30 hover:border-warfare-blue/50 text-warfare-gray hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {analysisData && (
                <div className="bg-warfare-dark/50 p-4 rounded-lg mb-4">
                  <h4 className="text-white font-medium mb-2">AI Analysis:</h4>
                  <p className="text-warfare-gray text-sm">{analysisData.analysis || 'Analysis complete'}</p>
                </div>
              )}

              <button
                onClick={resetMachine}
                className="bg-warfare-gray hover:bg-warfare-gray/80 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          )}

          {currentState === 'error' && (
            <div className="text-center">
              <p className="text-red-400 mb-4">Analysis failed. Please try again.</p>
              <button
                onClick={resetMachine}
                className="bg-warfare-red hover:bg-warfare-red/80 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeMachineDemo;
