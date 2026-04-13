'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAddMemory: () => void;
  isThinking: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onAddMemory, isThinking, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isThinking && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4">
      <div className="glass-card rounded-xl p-2 flex items-center gap-2 elegant-border">
        <motion.button
          onClick={onAddMemory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(107, 28, 35, 0.2)',
            border: '1px solid rgba(107, 28, 35, 0.3)',
          }}
          title="Add Memory"
        >
          <Plus className="w-5 h-5" style={{ color: '#8b2a33' }} />
        </motion.button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak your mind..."
          disabled={disabled || isThinking}
          className="flex-1 bg-transparent text-sm px-3 py-2 resize-none font-serif"
          style={{ color: '#e8e0d0' }}
          rows={1}
        />

        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || isThinking || disabled}
          whileHover={message.trim() && !isThinking ? { scale: 1.05 } : {}}
          whileTap={message.trim() && !isThinking ? { scale: 0.95 } : {}}
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: message.trim() && !isThinking 
              ? 'linear-gradient(135deg, #b8860b 0%, #8b6609 100%)' 
              : 'rgba(184, 134, 11, 0.1)',
            border: message.trim() && !isThinking 
              ? 'none' 
              : '1px solid rgba(184, 134, 11, 0.2)',
            cursor: message.trim() && !isThinking ? 'pointer' : 'not-allowed',
          }}
        >
          {isThinking ? (
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#b8860b' }} />
          ) : (
            <Send 
              className="w-5 h-5" 
              style={{ color: message.trim() && !isThinking ? '#0a0c10' : '#6a665a' }} 
            />
          )}
        </motion.button>
      </div>

      <div className="text-center mt-2">
        <span className="text-xs font-serif" style={{ color: '#4a4640' }}>
          Press Enter to speak • Shift+Enter for new thought
        </span>
      </div>
    </div>
  );
}
