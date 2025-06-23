
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare } from 'lucide-react';

interface ConversationSidebarProps {
  conversations: any[];
  currentConversation: any;
  onSelectConversation: (conversation: any) => void;
  onCreateConversation: (title?: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onCreateConversation
}) => {
  return (
    <div className="w-80 bg-warfare-card border-r border-warfare-gray/20 flex flex-col">
      <div className="p-4 border-b border-warfare-gray/20">
        <h1 className="text-xl font-bold text-white mb-4">AlphaAdvisor</h1>
        <Button
          onClick={() => onCreateConversation()}
          className="w-full bg-warfare-red hover:bg-warfare-red/80 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Strategy Session
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              currentConversation?.id === conversation.id
                ? 'bg-warfare-red/20 border border-warfare-red/30'
                : 'bg-warfare-dark/50 hover:bg-warfare-dark/70 border border-warfare-gray/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4 text-warfare-blue" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {conversation.title || 'Strategy Session'}
                </div>
                <div className="text-warfare-gray text-xs">
                  {new Date(conversation.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationSidebar;
