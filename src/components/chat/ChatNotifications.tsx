
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
    console.log('🔍 Chat Auth State Updated:', { 
      user: user ? user.email : 'No user', 
      authLoading 
    });
    if (!authLoading && user) {
      sonnerToast.success("Autenticação verificada.", { description: `Usuário ${user.email} conectado.`});
    } else if (!authLoading && !user) {
      sonnerToast.error("Usuário não autenticado.", { description: "Redirecionando para login."});
    }
  }, [user, authLoading]);

  useEffect(() => {
    console.log('🔄 Chat Connection Status Updated:', connectionStatus);
  }, [connectionStatus]);

  return null;
};

export default ChatNotifications;
