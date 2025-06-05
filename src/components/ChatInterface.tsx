
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfileSetup from './ProfileSetup';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserProfile {
  profile_complete: boolean;
  intensity_mode?: string;
  domain_focus?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ruthlessMode, setRuthlessMode] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if user needs profile setup on first load
    if (messages.length === 0) {
      sendMessage("Hello");
    }
  }, []);

  const appendToChat = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleProfileComplete = (profileData: any) => {
    setShowProfileSetup(false);
    setUserProfile({ 
      profile_complete: true, 
      intensity_mode: profileData.intensity_mode,
      domain_focus: profileData.domain_focus 
    });
    
    // Send a message to trigger AI response with new profile
    sendMessage("Profile setup complete. Ready for mission briefing.", profileData);
  };

  const handleProfileSkip = () => {
    setShowProfileSetup(false);
    setUserProfile({ profile_complete: false });
  };

  const sendMessage = async (content: string, profileData?: any) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat (only if not initial hello)
      if (content !== "Hello") {
        appendToChat('user', content);
      }
      
      // Clear input
      setInput('');
      
      // Send to AI
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          content, 
          ruthless: ruthlessMode,
          profileData: profileData || null
        }
      });

      if (error) throw error;

      // Update user profile from response
      if (data.userProfile) {
        setUserProfile(data.userProfile);
        
        // Show profile setup if not complete
        if (!data.userProfile.profile_complete && content === "Hello") {
          setShowProfileSetup(true);
          return; // Don't add the AI message to chat yet
        }
      }

      // Add AI response to chat
      appendToChat('assistant', data.reply);
      
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
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

  if (showProfileSetup) {
    return (
      <div className="flex flex-col h-full max-h-[600px] justify-center">
        <ProfileSetup 
          onComplete={handleProfileComplete}
          onSkip={handleProfileSkip}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warfare-dark/30 rounded-t-lg">
        {messages.length === 0 ? (
          <div className="text-center text-warfare-blue py-8">
            <h3 className="text-xl font-semibold mb-2">Welcome to Warfare Counselor™</h3>
            <p>Your tactical advisor is analyzing your profile...</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-warfare-red text-white'
                    : 'bg-warfare-dark text-white border border-warfare-blue/30'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-warfare-dark text-white border border-warfare-blue/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warfare-red"></div>
                <span>Analyzing tactical situation...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="p-4 bg-warfare-dark/50 rounded-b-lg border-t border-warfare-blue/30">
        {userProfile && (
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center space-x-4 text-warfare-blue">
              {userProfile.intensity_mode && (
                <span>Mode: {userProfile.intensity_mode}</span>
              )}
              {userProfile.domain_focus && (
                <span>Focus: {userProfile.domain_focus}</span>
              )}
            </div>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={ruthlessMode}
                onChange={(e) => setRuthlessMode(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Ruthless Mode</span>
            </label>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your tactical situation..."
            className="flex-1 bg-warfare-dark text-white border-warfare-blue/30 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-warfare-red hover:bg-warfare-red/80 text-white self-end"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
