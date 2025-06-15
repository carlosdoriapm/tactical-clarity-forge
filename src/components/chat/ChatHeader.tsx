
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

interface ChatHeaderProps {
  user: User | null;
  connectionStatus: 'unknown' | 'testing' | 'good' | 'error';
  isSending: boolean;
  onTestConnection: () => void;
  onNavigateToDashboard: () => void;
}

const getStatusIcon = (status: ChatHeaderProps['connectionStatus'], isSending: boolean) => {
    if (isSending) {
      return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />;
    }
    switch (status) {
      case 'testing':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
};

const getStatusText = (status: ChatHeaderProps['connectionStatus'], isSending: boolean) => {
    if (isSending) return 'Sending...';
    switch (status) {
        case 'testing': return 'Testing...';
        case 'good': return 'Connected';
        case 'error': return 'Error';
        default: return 'Unknown';
    }
};

const getStatusTitle = (status: ChatHeaderProps['connectionStatus'], isSending: boolean) => {
    if (isSending) return "Sending...";
    switch (status) {
        case 'testing': return "Testing Connection...";
        case 'good': return "Connected";
        case 'error': return "Connection Error";
        default: return "Unknown Status";
    }
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  connectionStatus,
  isSending,
  onTestConnection,
  onNavigateToDashboard,
}) => (
  <div className="flex-shrink-0 p-6 border-b border-warfare-red/20">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">AlphaAdvisor</h1>
          <p className="text-warfare-blue/80">Your tactical advisor is ready to listen</p>
          {user && (
            <p className="text-xs text-warfare-blue/60 mt-1">Signed in as: {user.email}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2" title={getStatusTitle(connectionStatus, isSending)}>
            {getStatusIcon(connectionStatus, isSending)}
            <span className="text-sm text-white">
              {getStatusText(connectionStatus, isSending)}
            </span>
          </div>
          <Button
            onClick={onTestConnection}
            disabled={connectionStatus === 'testing' || isSending}
            size="sm"
            variant="outline"
            className="border-warfare-red/30 text-white hover:bg-warfare-red/10"
          >
            Test Connection
          </Button>
          <Button
            onClick={onNavigateToDashboard}
            size="sm"
            variant="outline"
            className="border-warfare-blue/30 text-white hover:bg-warfare-blue/10"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default ChatHeader;

