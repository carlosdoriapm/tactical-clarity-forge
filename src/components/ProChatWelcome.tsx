
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProChatWelcomeProps {
  onMessageSent: (message: string, response: string) => void;
}

const ProChatWelcome: React.FC<ProChatWelcomeProps> = ({ onMessageSent }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    try {
      setIsLoading(true);
      
      console.log('Sending welcome message to AI chat function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          content: input.trim(), 
          ruthless: true
        }
      });

      console.log('AI chat response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to communicate with AI service');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.reply) {
        throw new Error('No response received from AI service');
      }

      onMessageSent(input.trim(), data.reply);
      setInput('');
      
    } catch (error) {
      console.error('Chat error:', error);
      
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 py-12 bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">Please log in to access the War Room.</p>
          <Button onClick={() => window.location.href = '/auth'} className="bg-red-700 hover:bg-red-800">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-black text-white">
      <h1 className="text-3xl md:text-5xl font-extrabold uppercase text-red-600 mb-4 text-center tracking-wide">
        You've Entered the War Room
      </h1>

      <p className="text-md md:text-lg text-gray-300 text-center max-w-xl mb-8 leading-relaxed">
        This is not chat. This is your field briefing.  
        Your mission: submit a current failure, weakness, or obstacle.  
        You will receive tactical orders. Follow them or fall behind.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-2">
        <label className="block mb-2 text-sm text-gray-400 tracking-wide">
          🔻 Describe your tactical situation:
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: Slipped back into dopamine trap. Skipped cold shower again."
          className="w-full px-4 py-3 bg-zinc-900 border border-red-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="mt-6 w-full bg-red-700 hover:bg-red-800 transition-all text-white font-bold py-3 uppercase tracking-widest shadow-lg"
        >
          {isLoading ? 'ANALYZING...' : 'Request Orders'}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-600 italic">
        Premium Chat Active — Tactical Intelligence Engaged
      </div>
    </div>
  );
};

export default ProChatWelcome;
