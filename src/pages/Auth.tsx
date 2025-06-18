
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warfare-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">Warfare Counselor™</h1>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white"
            >
              Back to Home
            </Button>
          </header>

          <div className="glass-card p-8 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Modo de Teste Ativo</h2>
            <p className="text-warfare-blue mb-8">
              A autenticação foi desabilitada para testes. Acesso livre a todas as funcionalidades.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-warfare-red hover:bg-warfare-red/80 text-white py-3 font-bold"
              >
                Acessar Dashboard
              </Button>
              
              <Button
                onClick={() => navigate('/chat')}
                className="w-full bg-warfare-blue hover:bg-warfare-blue/80 text-white py-3 font-bold"
              >
                Acessar Chat
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-warfare-gray text-sm">
              Modo de teste - todas as verificações de autenticação foram removidas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
