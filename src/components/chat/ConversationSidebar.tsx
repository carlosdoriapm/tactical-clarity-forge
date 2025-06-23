
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, HelpCircle } from 'lucide-react';

interface ConversationSidebarProps {
  conversations: any[];
  currentConversation: any;
  onSelectConversation: (conversation: any) => void;
  onCreateConversation: (title?: string) => void;
  onShowGuide: () => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onCreateConversation,
  onShowGuide
}) => {
  return (
    <div className="w-80 bg-warfare-card border-r border-warfare-gray/20 flex flex-col">
      <div className="p-4 border-b border-warfare-gray/20">
        <h1 className="text-xl font-bold text-white mb-4">AlphaAdvisor</h1>
        <div className="space-y-2">
          <Button
            onClick={() => onCreateConversation()}
            className="w-full bg-warfare-red hover:bg-warfare-red/80 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Strategic Session
          </Button>
          <Button
            onClick={onShowGuide}
            variant="outline"
            className="w-full text-warfare-blue border-warfare-blue/30 hover:bg-warfare-blue/10"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            How to Use Guide
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-warfare-gray mx-auto mb-2" />
            <p className="text-warfare-gray text-sm">No conversations yet</p>
            <p className="text-warfare-gray text-xs mt-1">Start your first strategic session</p>
          </div>
        )}
        
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
                  {conversation.title || 'Strategic Session'}
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
