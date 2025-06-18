
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Conversation, Message } from '@/types/conversation';

export const useConversations = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false); // Sem loading para modo de teste
  const hasInitializedRef = useRef(false);

  // Para modo de teste, usamos um usuário mock
  const mockUser = { id: 'test-user-id', email: 'test@example.com' };

  const loadMessages = useCallback(async (conversationId: string) => {
    // No modo de teste, retornamos mensagens vazias ou mock
    console.log('📝 Modo de teste: carregando mensagens mock para conversa', conversationId);
    setMessages([]);
  }, []);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    console.log('🔄 Selecionando conversa:', conversation.id);
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  const loadConversations = useCallback(async () => {
    console.log('📂 Modo de teste: criando conversa mock...');
    
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    
    // Criar uma conversa mock para testes
    const mockConversation: Conversation = {
      id: 'test-conversation-id',
      user_id: 'test-user-id',
      title: 'Conversa de Teste',
      context: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setConversations([mockConversation]);
    setCurrentConversation(mockConversation);
    setMessages([]);
    setLoading(false);
  }, []);

  const createConversation = useCallback(async (title?: string) => {
    console.log('🆕 Criando nova conversa mock...');
    
    const newConversation: Conversation = {
      id: `test-conversation-${Date.now()}`,
      user_id: 'test-user-id',
      title: title || 'Nova Conversa de Teste',
      context: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setMessages([]);
    console.log('✅ Nova conversa mock criada:', newConversation.id);
    return newConversation;
  }, []);

  const saveMessage = useCallback(async (conversationId: string, content: string, role: 'user' | 'assistant', metadata?: any) => {
    console.log('💾 Salvando mensagem mock...');
    
    const newMessage: Message = {
      id: `test-message-${Date.now()}`,
      conversation_id: conversationId,
      user_id: 'test-user-id',
      content,
      role,
      created_at: new Date().toISOString(),
      metadata
    };
    
    setMessages(prev => [...prev, newMessage]);
    console.log('✅ Mensagem mock salva');
    return newMessage;
  }, []);

  // Inicializar automaticamente para modo de teste
  useEffect(() => {
    if (!hasInitializedRef.current) {
      console.log('🚀 Inicializando modo de teste...');
      loadConversations();
    }
  }, [loadConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    createConversation,
    selectConversation,
    saveMessage,
    loadConversations
  };
};
