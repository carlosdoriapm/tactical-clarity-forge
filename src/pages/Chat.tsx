
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
  console.log('🎯 Chat component is loading...');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  console.log('👤 User in Chat:', user?.email || 'No user');
  
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

  console.log('🔧 Chat state initialized:', { 
    messagesCount: messages.length, 
    connectionStatus,
    isTyping 
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    console.log('📜 Messages updated, scrolling to bottom');
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('🚀 Chat component mounted successfully');
    
    // Test basic functionality
    try {
      console.log('✅ Supabase client available:', !!supabase);
      console.log('✅ Toast function available:', typeof toast);
      console.log('✅ User context available:', !!user);
    } catch (error) {
      console.error('❌ Error during Chat component initialization:', error);
    }
  }, []);

  const testConnection = async () => {
    console.log('🔍 Starting connection test...');
    setConnectionStatus('testing');
    
    try {
      console.log('📡 Invoking ai-chat function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'test connection',
          userId: user?.id || 'test-user-id'
        }
      });

      console.log('📨 Test response received:', { data, error });

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
          description: "Sistema de chat funcionando corretamente",
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

    console.log('🚀 ENVIANDO MENSAGEM');
    console.log('📝 Message:', inputValue.trim());
    console.log('👤 User ID:', user?.id || 'anonymous');

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

      let responseText = '';
      let hasError = false;

      if (data.success === false || data.error) {
        console.warn('⚠️ Response with error:', data.error);
        responseText = data.response || data.error || 'Ocorreu um erro, guerreiro.';
        hasError = true;
      } else if (data.response) {
        console.log('✅ Successful response');
        responseText = data.response;
        setConnectionStatus('good');
      } else {
        console.warn('⚠️ Unexpected response structure:', data);
        responseText = 'Ouço suas palavras, guerreiro. Deixe-me reunir meus pensamentos e fornecer-lhe o conselho adequado.';
      }

      console.log('💬 Final response text:', responseText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (!hasError) {
        toast({
          title: "Conselho recebido",
          description: "Seu conselheiro tático respondeu",
        });
      } else {
        toast({
          title: "Problema de comunicação",
          description: "Houve um problema, mas seu conselheiro respondeu",
          variant: "destructive",
        });
        setConnectionStatus('error');
      }

    } catch (error) {
      console.error('💥 ERRO CRÍTICO:');
      console.error('Type:', error.constructor.name);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'A conexão com a sala de guerra foi cortada, guerreiro. Nossas linhas de comunicação estão em baixa. Verifique sua conexão e tente novamente.',
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

  console.log('🎨 Rendering Chat component...');

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex flex-col">
        {/* Chat Header */}
        <div className="flex-shrink-0 p-6 border-b border-warfare-red/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Conselheiro de Guerra</h1>
                <p className="text-warfare-blue/80">Seu conselheiro tático aguarda seu conselho</p>
                {user && (
                  <p className="text-xs text-warfare-blue/60 mt-1">Conectado como: {user.email}</p>
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
              Pressione Enter para enviar • Shift + Enter para nova linha • Use "Testar Conexão" para verificar o status do sistema
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('💥 ERRO CRÍTICO AO RENDERIZAR CHAT:', error);
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro no Chat</h1>
          <p className="text-warfare-blue mb-4">Ocorreu um erro ao carregar o chat. Verifique o console para mais detalhes.</p>
          <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
        </div>
      </div>
    );
  }
};

export default Chat;
