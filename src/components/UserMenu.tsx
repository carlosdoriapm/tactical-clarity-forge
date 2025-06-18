
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserMenu = () => {
  const navigate = useNavigate();

  // Modo de teste - sempre mostrar menu como usuário logado
  const mockUser = { email: 'test@example.com' };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white">
          <User className="w-4 h-4 mr-2" />
          {mockUser.email.split('@')[0]} (teste)
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-warfare-card border-warfare-gray/20">
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="text-white hover:bg-warfare-accent/20"
        >
          <Shield className="w-4 h-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="text-white hover:bg-warfare-accent/20"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/admin')}
          className="text-white hover:bg-warfare-accent/20"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin (teste)
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-warfare-gray/20" />
        <DropdownMenuItem 
          onClick={() => navigate('/')}
          className="text-warfare-red hover:bg-warfare-red/20"
        >
          Voltar ao Início
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
