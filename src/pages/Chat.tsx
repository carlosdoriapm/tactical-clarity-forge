
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useAuth();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I hear your words, and I understand the weight they carry. Like a general surveying the battlefield, let me offer you this counsel: In every challenge lies the seed of triumph. Tell me more about the specific obstacles you face, and together we shall forge a path forward.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-6 border-b border-warfare-red/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Warfare Counselor</h1>
          <p className="text-warfare-blue/80">Your tactical advisor awaits your counsel</p>
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
                ref={textareaRef}
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
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
