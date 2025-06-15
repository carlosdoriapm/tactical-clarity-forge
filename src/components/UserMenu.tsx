
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserMenu = () => {
  const { user, signOut, roles } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        className="bg-warfare-red hover:bg-warfare-red/80 text-white"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white">
          <User className="w-4 h-4 mr-2" />
          {user.email?.split('@')[0]}
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
        {roles.includes('admin') && (
          <DropdownMenuItem 
            onClick={() => navigate('/admin')}
            className="text-white hover:bg-warfare-accent/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="border-warfare-gray/20" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-warfare-red hover:bg-warfare-red/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
