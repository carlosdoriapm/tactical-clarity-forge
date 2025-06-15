
import React from 'react';

interface ChatContainerProps {
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex flex-col">
    {children}
  </div>
);

export default ChatContainer;
