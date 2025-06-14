
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyDown,
  isTyping,
  isSending,
}) => (
  <div className="flex-shrink-0 p-6 border-t border-warfare-red/20 bg-gradient-to-r from-warfare-dark/50 to-slate-900/50 backdrop-blur-sm">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <Textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Fale sua mente, guerreiro..."
            className="min-h-[60px] max-h-32 resize-none bg-slate-800/50 border-warfare-red/30 text-white placeholder:text-warfare-blue/60 focus:border-warfare-red focus:ring-warfare-red/50 rounded-xl"
            disabled={isTyping || isSending}
          />
        </div>
        <Button
          onClick={onSendMessage}
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
);

export default ChatInput;
