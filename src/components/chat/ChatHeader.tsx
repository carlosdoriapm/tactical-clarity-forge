
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ChatHeaderProps {
  user: any;
  connectionStatus: 'unknown' | 'testing' | 'good' | 'error';
  isSending: boolean;
  onTestConnection: () => void;
  currentConversation?: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  connectionStatus,
  isSending,
  onTestConnection,
  currentConversation
}) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'good':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-400" />;
      case 'testing':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-warfare-card border-b border-warfare-gray/20 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {currentConversation?.title || 'Strategy Session'}
          </h2>
          <p className="text-warfare-gray text-sm">
            Strategic counsel and decision guidance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {connectionStatus !== 'good' && (
            <Button
              onClick={onTestConnection}
              variant="outline"
              size="sm"
              disabled={connectionStatus === 'testing'}
              className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white"
            >
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <span className="text-xs text-warfare-gray">
              {connectionStatus === 'good' ? 'Connected' : 
               connectionStatus === 'testing' ? 'Testing' :
               connectionStatus === 'error' ? 'Error' : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
