
import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Greetings, warrior. I am your tactical advisor, forged in the crucible of ancient wisdom and modern strategy. Speak, and I shall counsel you with the clarity of Caesar and the resolve of Marcus Aurelius. What weighs upon your mind today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      console.log('🔍 Testing connection to edge function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'test connection',
          userId: user?.id || 'test'
        }
      });

      console.log('Connection test result:', { data, error });

      if (error) {
        console.error('❌ Connection test failed:', error);
        setConnectionStatus('error');
        toast({
          title: "Connection Test Failed",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('✅ Connection test successful');
        setConnectionStatus('good');
        toast({
          title: "Connection OK",
          description: "Chat system is working properly",
        });
      }
    } catch (error) {
      console.error('💥 Connection test error:', error);
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    console.log('🚀 SENDING MESSAGE');
    console.log('Message:', currentMessage);
    console.log('User ID:', user?.id || 'anonymous');

    try {
      console.log('📡 Calling Supabase function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: currentMessage,
          userId: user?.id || 'anonymous'
        }
      });

      console.log('📨 SUPABASE RESPONSE:');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data received');
        throw new Error('No response received');
      }

      // Handle response
      let responseText = '';
      let hasError = false;

      if (data.success === false || data.error) {
        console.warn('⚠️ Response with error:', data.error);
        responseText = data.response || data.error || 'An error occurred, warrior.';
        hasError = true;
      } else if (data.response) {
        console.log('✅ Successful response');
        responseText = data.response;
        setConnectionStatus('good');
      } else {
        console.warn('⚠️ Unexpected response structure:', data);
        responseText = 'I hear your words, warrior. Let me gather my thoughts and provide you with proper counsel.';
      }

      console.log('💬 Final response text:', responseText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Show toast
      if (!hasError) {
        toast({
          title: "Counsel received",
          description: "Your tactical advisor has responded",
        });
      } else {
        toast({
          title: "Communication issue",
          description: "There was an issue, but your advisor responded",
          variant: "destructive",
        });
        setConnectionStatus('error');
      }

    } catch (error) {
      console.error('💥 CRITICAL ERROR:');
      console.error('Type:', error.constructor.name);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'The connection to the war room has been severed, warrior. Our communication lines are down. Check your connection and try again.',
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('error');
      
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
      console.log('🏁 Message sending completed');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-6 border-b border-warfare-red/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Warfare Counselor</h1>
              <p className="text-warfare-blue/80">Your tactical advisor awaits your counsel</p>
              {user && (
                <p className="text-xs text-warfare-blue/60 mt-1">Connected as: {user.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm text-white">
                  {connectionStatus === 'testing' && 'Testing...'}
                  {connectionStatus === 'good' && 'Connected'}
                  {connectionStatus === 'error' && 'Error'}
                  {connectionStatus === 'unknown' && 'Unknown'}
                </span>
              </div>
              <Button
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                size="sm"
                variant="outline"
                className="border-warfare-red/30 text-white hover:bg-warfare-red/10"
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  message.isBot
                    ? 'bg-gradient-to-r from-warfare-red/10 to-warfare-yellow/10 backdrop-blur-sm border border-warfare-red/20 text-white shadow-lg'
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg'
                }`}
              >
                <p className="text-base leading-relaxed">{message.content}</p>
                <div className="mt-2 text-xs text-warfare-blue/60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-2xl rounded-2xl px-6 py-4 bg-gradient-to-r from-warfare-red/10 to-warfare-yellow/10 backdrop-blur-sm border border-warfare-red/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-warfare-red rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-warfare-yellow rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-warfare-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-xs text-warfare-blue/60 mt-2">Your advisor is formulating counsel...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-6 border-t border-warfare-red/20 bg-gradient-to-r from-warfare-dark/50 to-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Speak your mind, warrior..."
                className="min-h-[60px] max-h-32 resize-none bg-slate-800/50 border-warfare-red/30 text-white placeholder:text-warfare-blue/60 focus:border-warfare-red focus:ring-warfare-red/50 rounded-xl"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="h-[60px] w-[60px] rounded-xl bg-gradient-to-r from-warfare-red to-red-600 hover:from-red-600 hover:to-warfare-red text-white shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-warfare-blue/60 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line • Use "Test Connection" to verify system status
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
