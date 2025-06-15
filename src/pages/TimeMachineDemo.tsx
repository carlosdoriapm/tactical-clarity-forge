
import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import { dtmMachine } from '@/machines/dtmMachine';
import { BackToDashboard } from '@/components/BackToDashboard';
import DecisionInput from '@/components/DecisionInput';
import { Button } from '@/components/ui/button';
import LoaderSpinner from '@/components/LoaderSpinner';

const TimeMachineDemo = () => {
  const [state, send] = useMachine(dtmMachine);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (decision: string) => {
    setInputValue(decision);
    send({ type: 'SUBMIT', input: decision });
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        timeline_short: [
          { date: '2025-07-01', event: 'Primeira semana de implementação' },
          { date: '2025-08-15', event: 'Primeiros resultados visíveis' },
          { date: '2025-10-01', event: 'Avaliação trimestral' }
        ],
        timeline_long: [
          { date: '2026-01-01', event: 'Consolidação da nova rotina' },
          { date: '2026-06-01', event: 'Resultados significativos alcançados' },
          { date: '2027-01-01', event: 'Transformação completa estabelecida' }
        ]
      };
      send({ type: 'SUCCESS', result: mockResult });
    }, 2000);
  };

  const handleRetry = () => {
    send({ type: 'RETRY' });
    handleSubmit(inputValue);
  };

  const handleNewDecision = () => {
    send({ type: 'NEW_DECISION' });
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-warfare-dark p-6">
      <div className="max-w-6xl mx-auto">
        <BackToDashboard />
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Decision Time-Machine</h1>
          <p className="text-warfare-blue text-lg">
            Visualize os possíveis futuros das suas decisões estratégicas
          </p>
        </header>

        {state.matches('IDLE') && (
          <div className="max-w-2xl mx-auto">
            <DecisionInput onSubmit={handleSubmit} />
          </div>
        )}

        {state.matches('SUBMITTING') && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoaderSpinner show={true} />
            <p className="text-warfare-blue mt-4">Analisando cenários futuros...</p>
          </div>
        )}

        {state.matches('ERROR') && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-red-400 font-bold mb-2">Erro na Análise</h3>
              <p className="text-white mb-4">{state.context.error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRetry} className="bg-warfare-red hover:bg-red-600">
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={handleNewDecision} 
                  variant="outline" 
                  className="border-warfare-blue text-warfare-blue"
                >
                  Nova Decisão
                </Button>
              </div>
            </div>
          </div>
        )}

        {state.matches('SUCCESS') && state.context.result && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-warfare-dark/90 border border-warfare-blue/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">Cenário de Curto Prazo</h3>
                <p className="text-warfare-blue mb-4">Próximos 6-12 meses</p>
                <div className="space-y-3">
                  {state.context.result.timeline_short.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-warfare-red rounded-full mt-2"></div>
                      <div>
                        <div className="text-warfare-blue text-sm">{item.date}</div>
                        <div className="text-white">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-warfare-dark/90 border border-warfare-blue/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">Cenário de Longo Prazo</h3>
                <p className="text-warfare-blue mb-4">1-3 anos à frente</p>
                <div className="space-y-3">
                  {state.context.result.timeline_long.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-warfare-red rounded-full mt-2"></div>
                      <div>
                        <div className="text-warfare-blue text-sm">{item.date}</div>
                        <div className="text-white">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleNewDecision}
                className="bg-warfare-blue hover:bg-blue-600 text-white"
              >
                Analisar Nova Decisão
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeMachineDemo;
