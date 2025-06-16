
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
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages: " + error.message,
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    console.log('🔄 Selecting conversation:', conversation.id);
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  const loadConversations = useCallback(async () => {
    if (!user || hasInitializedRef.current) {
      console.log('⏭️ Skipping loadConversations - no user or already initialized');
      return;
    }
    
    console.log('📂 Loading conversations...');
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      console.log('📋 Conversations loaded:', data?.length || 0);
      setConversations(data || []);
      
      // Load the most recent conversation if it exists
      if (data && data.length > 0) {
        console.log('🎯 Loading most recent conversation automatically');
        await selectConversation(data[0]);
      }
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, selectConversation]);

  const createConversation = useCallback(async (title?: string) => {
    if (!user) return null;
    
    console.log('🆕 Creating new conversation...');
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: title || 'New Conversation',
          context: {}
        })
        .select()
        .single();

      if (error) throw error;
      
      const newConversation = data as Conversation;
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      console.log('✅ New conversation created:', newConversation.id);
      return newConversation;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation: " + error.message,
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
      
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      return newMessage;
    } catch (error: any) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message: " + error.message,
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
