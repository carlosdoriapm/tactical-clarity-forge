
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Loader2, HelpCircle } from 'lucide-react';

interface ChatHeaderProps {
  connectionStatus: 'unknown' | 'testing' | 'good' | 'error';
  isSending: boolean;
  onTestConnection: () => void;
  currentConversation?: any;
  onShowGuide: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  connectionStatus,
  isSending,
  onTestConnection,
  currentConversation,
  onShowGuide
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
            {currentConversation?.title || 'Strategic Session'}
          </h2>
          <p className="text-warfare-gray text-sm">
            AI-powered strategic counseling and decision guidance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={onShowGuide}
            variant="outline"
            size="sm"
            className="text-warfare-blue border-warfare-blue/30 hover:bg-warfare-blue/10"
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            Guide
          </Button>
          
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
