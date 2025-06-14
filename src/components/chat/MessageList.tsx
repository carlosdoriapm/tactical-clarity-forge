
import React from 'react';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-6">
    <div className="max-w-4xl mx-auto space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-2xl rounded-2xl px-6 py-4 ${
              message.isBot
                ? 'bg-gradient-to-r from-warfare-red/10 to-warfare-yellow/10 backdrop-blur-sm border border-warfare-red/20 text-white shadow-lg'
                : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg'
            }`}
          >
            <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <div className="mt-2 text-xs text-warfare-blue/60">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}

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

export default MessageList;
