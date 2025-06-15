
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function BackToDashboard() {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate('/')}
      className="flex items-center gap-1 text-white hover:bg-warfare-accent/20 hover:text-white"
    >
      <ArrowLeft size={16} /> 
      <span>Return to Dashboard</span>
    </Button>
  );
}
