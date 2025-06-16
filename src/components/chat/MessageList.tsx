
import React from 'react';
import { Message as ChatMessage } from '@/types/chat';
import { Message as ConversationMessage } from '@/types/conversation';

interface MessageListProps {
  messages: (ChatMessage | ConversationMessage)[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, messagesEndRef }) => {
  
  const convertMessage = (message: ChatMessage | ConversationMessage): ChatMessage => {
    // Se já é uma mensagem de chat, retorna como está
    if ('isBot' in message) {
      return message as ChatMessage;
    }
    
    // Se é uma mensagem de conversa, converte para formato de chat
    const conversationMessage = message as ConversationMessage;
    return {
      id: conversationMessage.id,
      content: conversationMessage.content,
      isBot: conversationMessage.role === 'assistant',
      timestamp: new Date(conversationMessage.created_at)
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-2xl rounded-2xl px-6 py-4 bg-gradient-to-r from-warfare-red/10 to-warfare-yellow/10 backdrop-blur-sm border border-warfare-red/20 text-white shadow-lg">
              <p className="text-base leading-relaxed">
                Hey—I'm AlphaAdvisor. First, I'll ask you a few questions so I can truly get to know you.
              </p>
              <div className="mt-2 text-xs text-warfare-blue/60">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => {
          const chatMessage = convertMessage(message);
          return (
            <div
              key={chatMessage.id}
              className={`flex ${chatMessage.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  chatMessage.isBot
                    ? 'bg-gradient-to-r from-warfare-red/10 to-warfare-yellow/10 backdrop-blur-sm border border-warfare-red/20 text-white shadow-lg'
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg'
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{chatMessage.content}</p>
                <div className="mt-2 text-xs text-warfare-blue/60">
                  {chatMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-2xl rounded-2xl px-6 py-4 bg-gradient-to-r from-warfare-red/10 to-warfare-yellow/10 backdrop-blur-sm border border-warfare-red/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-warfare-red rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-warfare-yellow rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-warfare-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-xs text-warfare-blue/60 mt-2">Seu conselheiro está formulando um conselho...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
