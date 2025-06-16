
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Conversation, Message } from '@/types/conversation';

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const hasInitializedRef = useRef(false);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const convertedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        user_id: msg.user_id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        created_at: msg.created_at,
        metadata: msg.metadata
      }));
      
      setMessages(convertedMessages);
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar mensagens: " + error.message,
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    console.log('🔄 Selecionando conversa:', conversation.id);
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  const loadConversations = useCallback(async () => {
    if (!user || hasInitializedRef.current) {
      console.log('⏭️ Pulando loadConversations - usuário ou já inicializado');
      return;
    }
    
    console.log('📂 Carregando conversas...');
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      console.log('📋 Conversas carregadas:', data?.length || 0);
      setConversations(data || []);
      
      // Carrega a conversa mais recente se existir
      if (data && data.length > 0) {
        console.log('🎯 Carregando conversa mais recente automaticamente');
        await selectConversation(data[0]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar conversas: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, selectConversation]);

  const createConversation = useCallback(async (title?: string) => {
    if (!user) return null;
    
    console.log('🆕 Criando nova conversa...');
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: title || 'Nova Conversa',
          context: {}
        })
        .select()
        .single();

      if (error) throw error;
      
      const newConversation = data as Conversation;
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      console.log('✅ Nova conversa criada:', newConversation.id);
      return newConversation;
    } catch (error: any) {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar conversa: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  const saveMessage = useCallback(async (conversationId: string, content: string, role: 'user' | 'assistant', metadata?: any) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          content,
          role,
          metadata
        })
        .select()
        .single();

      if (error) throw error;
      
      const newMessage: Message = {
        id: data.id,
        conversation_id: data.conversation_id,
        user_id: data.user_id,
        content: data.content,
        role: data.role as 'user' | 'assistant',
        created_at: data.created_at,
        metadata: data.metadata
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Atualiza o timestamp da conversa
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      return newMessage;
    } catch (error: any) {
      console.error('Erro ao salvar mensagem:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar mensagem: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Effect simplificado que só roda uma vez
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      console.log('🚀 Inicializando conversas...');
      loadConversations();
    }
  }, [user, loadConversations]);

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
