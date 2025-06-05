
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warfare-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Warfare Counselor™ Chat</h1>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white"
            >
              Back to Home
            </Button>
          </header>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Premium Chat Active</h2>
              <p className="text-warfare-blue">
                Get tactical advice from your Warfare Counselor for any situation.
              </p>
            </div>
            
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
