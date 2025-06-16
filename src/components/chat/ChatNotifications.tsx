
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
      sonnerToast.success("Authentication verified.", { description: `User ${user.email} connected.`});
    } else if (!authLoading && !user) {
      sonnerToast.error("User not authenticated.", { description: "Redirecting to login."});
    }
  }, [user, authLoading]);

  useEffect(() => {
    console.log('🔄 Chat Connection Status Updated:', connectionStatus);
  }, [connectionStatus]);

  return null;
};

export default ChatNotifications;
