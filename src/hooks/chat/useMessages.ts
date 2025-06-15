
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey—I'm AlphaAdvisor. First, I'll ask you a few questions so I can truly get to know you.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return {
    messages,
    messagesEndRef,
    addMessage
  };
}
