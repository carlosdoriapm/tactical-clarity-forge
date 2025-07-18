
import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginPromptProps {
  onLoginClick: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginClick }) => (
  <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <LogIn className="w-16 h-16 text-warfare-red mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
      <p className="text-warfare-blue mb-8">
        Para acessar o Conselheiro de Guerra, você precisa estar autenticado.
        Faça login para continuar sua jornada tática.
      </p>
      <Button
        onClick={onLoginClick}
        className="bg-warfare-red hover:bg-warfare-red/80 text-white px-8 py-3"
      >
        Fazer Login
      </Button>
    </div>
  </div>
);

export default LoginPrompt;
