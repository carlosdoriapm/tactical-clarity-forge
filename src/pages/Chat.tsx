
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
          
          <div className="glass-card p-8 rounded-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to Premium Chat</h2>
              <p className="text-warfare-blue">
                You now have access to unlimited tactical advice from your Warfare Counselor.
              </p>
            </div>
            
            <div className="bg-warfare-dark/50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-warfare-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-warfare-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Chat Interface Coming Soon</h3>
                <p className="text-warfare-blue">
                  Your premium chat interface will be available here. Start getting tactical advice for any situation!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
