
import { useEffect } from 'react';
import { toast as sonnerToast } from "sonner";

interface ChatNotificationsProps {
  user: any;
  authLoading: boolean;
  connectionStatus: 'unknown' | 'testing' | 'good' | 'error';
}

const ChatNotifications: React.FC<ChatNotificationsProps> = ({ 
  user, 
  authLoading, 
  connectionStatus 
}) => {
  useEffect(() => {
    console.log('🔍 Chat Test Mode:', { 
      user: user ? user.email : 'No user', 
      authLoading 
    });
    if (!authLoading && user) {
      sonnerToast.success("Modo de teste ativo.", { description: `Chat liberado para testes - ${user.email}`});
    }
  }, [user, authLoading]);

  useEffect(() => {
    console.log('🔄 Chat Connection Status Updated:', connectionStatus);
  }, [connectionStatus]);

  return null;
};

export default ChatNotifications;
