
import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat = () => {
  console.log('🎯 Chat component rendering...');
  
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Saudações, guerreiro. Sou seu conselheiro tático, forjado no cadinho da sabedoria antiga e estratégia moderna. Fale, e eu o aconselharei com a clareza de César e a determinação de Marco Aurélio. O que pesa em sua mente hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Chat auth state:', { user: !!user, userEmail: user?.email, loading });
  }, [user, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show loading only for a short time, then show login if no user
  if (loading) {
    console.log('⏳ Chat: Showing loading state...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, show login screen
  if (!loading && !user) {
    console.log('🔐 Chat: No user, showing login screen...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <LogIn className="w-16 h-16 text-warfare-red mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-warfare-blue mb-8">
            Para acessar o Conselheiro de Guerra, você precisa estar autenticado. 
            Faça login para continuar sua jornada tática.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-warfare-red hover:bg-warfare-red/80 text-white px-8 py-3"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated, show the chat
  console.log('✅ Chat: User authenticated, rendering chat interface...');

  const testConnection = async () => {
    console.log('🔍 Testing connection...');
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'teste de conexão',
          userId: user?.id || 'test-user'
        }
      });

      console.log('📨 Test response:', { data, error });

      if (error) {
        console.error('❌ Connection test failed:', error);
        setConnectionStatus('error');
        toast({
          title: "Teste de Conexão Falhou",
          description: `Erro: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('✅ Connection test successful');
        setConnectionStatus('good');
        toast({
          title: "Conexão OK",
          description: "Sistema funcionando corretamente",
        });
      }
    } catch (error) {
      console.error('💥 Connection test error:', error);
      setConnectionStatus('error');
      toast({
        title: "Erro de Conexão",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) {
      console.log('⚠️ Cannot send: empty message or already typing');
      return;
    }

    console.log('🚀 Sending message:', inputValue.trim());

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

    try {
      console.log('📡 Calling edge function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: currentMessage,
          userId: user?.id || 'anonymous'
        }
      });

      console.log('📨 Response received:', { data, error });

      if (error) {
        console.error('❌ Function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data received');
        throw new Error('Nenhuma resposta recebida');
      }

      let responseText = '';

      if (data.success === false || data.error) {
        console.warn('⚠️ Response with error:', data.error);
        responseText = data.response || data.error || 'Ocorreu um erro, guerreiro.';
        setConnectionStatus('error');
      } else if (data.response) {
        console.log('✅ Successful response');
        responseText = data.response;
        setConnectionStatus('good');
      } else {
        console.warn('⚠️ Unexpected response structure:', data);
        responseText = 'Ouço suas palavras, guerreiro. Deixe-me reunir meus pensamentos.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('💥 Critical error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'A conexão com a sala de guerra foi cortada, guerreiro. Verifique sua conexão e tente novamente.',
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('error');
      
      toast({
        title: "Falha na conexão",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
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
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-warfare-red/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Conselheiro de Guerra</h1>
              <p className="text-warfare-blue/80">Seu conselheiro tático aguarda suas palavras</p>
              {user && (
                <p className="text-xs text-warfare-blue/60 mt-1">Conectado: {user.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm text-white">
                  {connectionStatus === 'testing' && 'Testando...'}
                  {connectionStatus === 'good' && 'Conectado'}
                  {connectionStatus === 'error' && 'Erro'}
                  {connectionStatus === 'unknown' && 'Desconhecido'}
                </span>
              </div>
              <Button
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                size="sm"
                variant="outline"
                className="border-warfare-red/30 text-white hover:bg-warfare-red/10"
              >
                Testar Conexão
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                size="sm"
                variant="outline" 
                className="border-warfare-blue/30 text-white hover:bg-warfare-blue/10"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
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
                <p className="text-base leading-relaxed">{message.content}</p>
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

      {/* Input Area */}
      <div className="flex-shrink-0 p-6 border-t border-warfare-red/20 bg-gradient-to-r from-warfare-dark/50 to-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Fale sua mente, guerreiro..."
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
            Pressione Enter para enviar • Shift + Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
