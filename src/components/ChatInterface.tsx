
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProChatWelcome from './ProChatWelcome';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const appendToChat = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleWelcomeMessageSent = (userMessage: string, aiResponse: string) => {
    appendToChat('user', userMessage);
    appendToChat('assistant', aiResponse);
    setShowWelcome(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      
      appendToChat('user', content);
      setInput('');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          content, 
          ruthless: true
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to communicate with AI service');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      appendToChat('assistant', data.reply);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = "Failed to send message. Please try again.";
      let toastDuration = 5000;
      
      if (error.message.includes('busy') || error.message.includes('high demand')) {
        errorMessage = "The AI is experiencing high demand. Please wait 2-3 minutes and try again.";
        toastDuration = 8000;
      } else if (error.message.includes('too quickly') || error.message.includes('wait a moment')) {
        errorMessage = "Please wait a moment before sending another message.";
        toastDuration = 6000;
      }
      
      toast({
        title: "Service Busy",
        description: errorMessage,
        variant: "destructive",
        duration: toastDuration,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      sendMessage(input.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (showWelcome) {
    return <ProChatWelcome onMessageSent={handleWelcomeMessageSent} />;
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-black text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/50 rounded-t-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-red-700 text-white'
                  : 'bg-zinc-800 text-white border border-red-700/30'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 block mt-1">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-white border border-red-700/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span>Analyzing tactical situation...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900/80 rounded-b-lg border-t border-red-700/30">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Submit your next tactical situation..."
            className="flex-1 bg-zinc-800 text-white border-red-700/30 resize-none placeholder-gray-500"
            rows={2}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-red-700 hover:bg-red-800 text-white self-end font-bold uppercase tracking-wide"
          >
            Orders
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
