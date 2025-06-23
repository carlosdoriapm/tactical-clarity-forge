
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Conversation, Message } from '@/types/conversation';

const STORAGE_KEY_CONVERSATIONS = 'alphaadvisor_conversations';
const STORAGE_KEY_MESSAGES = 'alphaadvisor_messages';

export const useConversations = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const hasInitializedRef = useRef(false);

  const mockUser = { id: 'default-user', email: 'user@example.com' };

  // Load conversations from localStorage
  const loadConversations = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (stored) {
        const parsedConversations = JSON.parse(stored);
        setConversations(parsedConversations);
        
        // Select the most recent conversation
        if (parsedConversations.length > 0) {
          const mostRecent = parsedConversations[0];
          setCurrentConversation(mostRecent);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (stored) {
        const allMessages = JSON.parse(stored);
        const conversationMessages = allMessages[conversationId] || [];
        setMessages(conversationMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  }, []);

  // Select a conversation
  const selectConversation = useCallback(async (conversation: Conversation) => {
    console.log('🔄 Selecting conversation:', conversation.id);
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  // Create new conversation
  const createConversation = useCallback(async (title?: string) => {
    console.log('🆕 Creating new conversation...');
    
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      user_id: mockUser.id,
      title: title || `Strategy Session ${new Date().toLocaleDateString()}`,
      context: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversation(newConversation);
    setMessages([]);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConversations));
    
    console.log('✅ New conversation created:', newConversation.id);
    return newConversation;
  }, [conversations, mockUser.id]);

  // Save message
  const saveMessage = useCallback(async (conversationId: string, content: string, role: 'user' | 'assistant', metadata?: any) => {
    console.log('💾 Saving message...');
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      user_id: mockUser.id,
      content,
      role,
      created_at: new Date().toISOString(),
      metadata
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Save to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
      const allMessages = stored ? JSON.parse(stored) : {};
      allMessages[conversationId] = updatedMessages;
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(allMessages));
    } catch (error) {
      console.error('Error saving message:', error);
    }
    
    console.log('✅ Message saved');
    return newMessage;
  }, [messages, mockUser.id]);

  // Initialize
  useEffect(() => {
    if (!hasInitializedRef.current) {
      console.log('🚀 Initializing conversations...');
      hasInitializedRef.current = true;
      loadConversations();
    }
  }, [loadConversations]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation, loadMessages]);

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
