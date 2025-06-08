
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Warfare Counselor™ Chat</h1>
          <p className="text-warfare-gray">Get tactical advice from your Warfare Counselor for any situation.</p>
        </header>
        
        <div className="glass-card p-6 rounded-xl">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;
