import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, LogIn, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat = () => {
  console.log('🎯 Chat component rendering/re-rendering...');
  
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast(); // Shadcn toast
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
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'good' | 'error'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging for auth state
  useEffect(() => {
    console.log('🔍 Chat Auth State Updated:', { 
      user: user ? user.email : 'No user', 
      authLoading 
    });
    if (!authLoading && user) {
      sonnerToast.success("Autenticação verificada.", { description: `Usuário ${user.email} conectado.`});
    } else if (!authLoading && !user) {
      sonnerToast.error("Usuário não autenticado.", { description: "Redirecionando para login."});
    }
  }, [user, authLoading]);

  // Debug logging for connection status
  useEffect(() => {
    console.log('🔄 Chat Connection Status Updated:', connectionStatus);
    // sonnerToast.info(`Status da conexão: ${connectionStatus}`); // Might be too noisy
  }, [connectionStatus]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show loading state if auth is still loading
  if (authLoading) {
    console.log('⏳ Chat: Auth loading, showing loading screen...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
          <p className="text-white">Carregando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not auth loading and no user, show login screen
  if (!user) { // Simplified condition as authLoading is false here
    console.log('🔐 Chat: No user authenticated, showing login screen...');
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
  console.log('✅ Chat: User authenticated, rendering chat interface for', user?.email);

  const testConnection = async () => {
    if (connectionStatus === 'testing' || isSending) {
      console.log('⚠️ Test Connection: Already testing or sending message.');
      sonnerToast.info("Teste de conexão já em progresso ou mensagem sendo enviada.");
      return;
    }
    console.log('🔍 Chat: testConnection initiated...');
    sonnerToast.loading("Testando conexão com o servidor...");
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: 'teste de conexão',
          userId: user?.id || 'test-user-connection-test',
          isTest: true
        }
      });

      console.log('📨 Chat: testConnection - Response from Supabase function:', { data, error });

      if (error) {
        console.error('❌ Chat: testConnection - Supabase function invocation error:', error);
        setConnectionStatus('error');
        sonnerToast.error("Teste de Conexão Falhou", { description: `Erro ao invocar função: ${error.message}`});
      } else if (data && data.success === false) {
        console.warn('⚠️ Chat: testConnection - Function returned success:false:', data);
        setConnectionStatus('error');
        sonnerToast.error("Teste de Conexão Falhou", { description: data.response || data.error || "A função retornou um erro."});
      } else if (data && data.success === true) {
        console.log('✅ Chat: testConnection - Successful.');
        setConnectionStatus('good');
        sonnerToast.success("Conexão Estabelecida", { description: "O sistema de comunicação está operacional." });
      } else {
        console.error('❌ Chat: testConnection - Unexpected response structure:', data);
        setConnectionStatus('error');
        sonnerToast.warning("Teste de Conexão Inconclusivo", { description: "Resposta inesperada da função de teste." });
      }
    } catch (error) {
      console.error('💥 Chat: testConnection - Critical error during test:', error);
      setConnectionStatus('error');
      sonnerToast.error("Erro Crítico no Teste de Conexão", { description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido." });
    }
  };

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping || isSending) {
      console.log('⚠️ Chat: handleSend - Cannot send: empty message, bot typing, or message already sending.', { trimmedInput, isTyping, isSending });
      if (!trimmedInput) sonnerToast.warning("Mensagem vazia", { description: "Por favor, digite sua consulta." });
      if (isTyping) sonnerToast.info("Aguarde", { description: "O conselheiro está formulando uma resposta." });
      if (isSending) sonnerToast.info("Enviando", { description: "Sua mensagem anterior ainda está sendo processada." });
      return;
    }

    console.log('🚀 Chat: handleSend - Sending message:', trimmedInput);
    sonnerToast.info("Enviando sua mensagem...", { id: "sending-message" });
    setIsSending(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true); // Bot starts "typing" immediately after user sends

    try {
      console.log('📡 Chat: handleSend - Calling edge function "ai-chat" with:', { message: trimmedInput, userId: user?.id });
      
      const { data, error: functionInvokeError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: trimmedInput,
          userId: user?.id || 'anonymous-chat-user'
        }
      });
      sonnerToast.dismiss("sending-message");

      console.log('📨 Chat: handleSend - Response from "ai-chat":', { data, functionInvokeError });

      if (functionInvokeError) {
        console.error('❌ Chat: handleSend - Error invoking "ai-chat":', functionInvokeError);
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Falha ao comunicar com o conselheiro. Verifique sua conexão ou tente mais tarde.',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botErrorMessage]);
        sonnerToast.error("Erro de Comunicação", { description: `Não foi possível enviar sua mensagem: ${functionInvokeError.message}` });
        return;
      }

      if (!data) {
        console.error('❌ Chat: handleSend - No data received from "ai-chat".');
        setConnectionStatus('error');
        const botErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'O conselheiro não retornou uma resposta. Tente novamente.',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botErrorMessage]);
        sonnerToast.error("Resposta Não Recebida", { description: "A função 'ai-chat' não retornou dados." });
        return;
      }

      let responseText = '';
      if (data.success === false || data.error) {
        console.warn('⚠️ Chat: handleSend - "ai-chat" returned success:false or an error property:', data);
        responseText = data.response || data.error || 'Ocorreu um erro ao processar sua solicitação, guerreiro.';
        setConnectionStatus('error');
        sonnerToast.warning("Conselheiro Indisponível", { description: responseText });
      } else if (data.response) {
        console.log('✅ Chat: handleSend - "ai-chat" successful response.');
        responseText = data.response;
        setConnectionStatus('good');
        sonnerToast.success("Conselho Recebido");
      } else {
        console.warn('⚠️ Chat: handleSend - Unexpected response structure from "ai-chat":', data);
        responseText = 'Recebi uma resposta inesperada do conselheiro. Deixe-me tentar entender.';
        setConnectionStatus('error'); // Or 'unknown' if appropriate
        sonnerToast.warning("Resposta Inesperada", { description: "O formato da resposta do conselheiro não é o esperado." });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (criticalError) {
      console.error('💥 Chat: handleSend - Critical error during send process:', criticalError);
      setConnectionStatus('error');
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'A conexão com a sala de guerra foi cortada criticamente. Verifique sua conexão e tente novamente.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botErrorMessage]);
      sonnerToast.error("Falha Crítica na Conexão", { description: criticalError instanceof Error ? criticalError.message : "Erro desconhecido ao enviar mensagem." });
    } finally {
      setIsTyping(false);
      setIsSending(false);
      sonnerToast.dismiss("sending-message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusIcon = () => {
    if (isSending) {
      // This div can have a title for tooltip
      return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" title="Enviando..." />;
    }
    switch (connectionStatus) {
      case 'testing':
        // This div can have a title for tooltip
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" title="Testando Conexão..." />;
      case 'good':
        // Lucide icons don't take 'title' prop directly this way for HTML tooltips
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: // unknown
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
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
                <p className="text-xs text-warfare-blue/60 mt-1">Conectado como: {user.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2" title={
                isSending ? "Enviando..." :
                connectionStatus === 'testing' ? "Testando Conexão..." :
                connectionStatus === 'good' ? "Conectado" :
                connectionStatus === 'error' ? "Erro de Conexão" :
                "Status Desconhecido"
              }>
                {getStatusIcon()}
                <span className="text-sm text-white">
                  {isSending && 'Enviando...'}
                  {!isSending && connectionStatus === 'testing' && 'Testando...'}
                  {!isSending && connectionStatus === 'good' && 'Conectado'}
                  {!isSending && connectionStatus === 'error' && 'Erro'}
                  {!isSending && connectionStatus === 'unknown' && 'Desconhecido'}
                </span>
              </div>
              <Button
                onClick={testConnection}
                disabled={connectionStatus === 'testing' || isSending}
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
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
                disabled={isTyping || isSending}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || isSending}
              className="h-[60px] w-[60px] rounded-xl bg-gradient-to-r from-warfare-red to-red-600 hover:from-red-600 hover:to-warfare-red text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
