
import { useState, useEffect } from 'react';
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

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
      
      // Se há conversas, carrega a mais recente automaticamente
      if (data && data.length > 0 && !currentConversation) {
        await selectConversation(data[0]);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar conversas: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title?: string) => {
    if (!user) return null;
    
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
      setMessages([]); // Limpar mensagens para nova conversa
      return newConversation;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao criar conversa: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Converter os dados do banco para o tipo Message correto
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
      toast({
        title: "Erro",
        description: "Falha ao carregar mensagens: " + error.message,
        variant: "destructive",
      });
    }
  };

  const saveMessage = async (conversationId: string, content: string, role: 'user' | 'assistant', metadata?: any) => {
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
      
      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      return newMessage;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao salvar mensagem: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

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
