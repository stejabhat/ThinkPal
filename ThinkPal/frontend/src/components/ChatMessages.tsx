'use client';

import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { Memory } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mode?: 'real' | 'past' | 'future';
  memories?: Memory[];
}

interface ChatMessagesProps {
  messages: Message[];
  isThinking?: boolean;
}

const modeColors: Record<string, string> = {
  real: '#b8860b',
  past: '#6b1c23',
  future: '#1e4d40',
};

export default function ChatMessages({ messages, isThinking }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollable p-4 space-y-4">
      {messages.length === 0 && !isThinking && (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-4"
          >
            <Bot className="w-12 h-12 text-gold" />
          </motion.div>
          <h2 className="text-lg font-serif font-medium mb-2" style={{ color: '#e8e0d0' }}>
            Welcome to Your Mind
          </h2>
          <p className="text-sm max-w-md font-serif" style={{ color: '#6a665a' }}>
            Consult with your past, present, and future selves. 
            Select a persona and begin your dialogue.
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: message.role === 'user' 
                  ? 'rgba(184, 134, 11, 0.2)' 
                  : `${modeColors[message.mode || 'real']}20`,
                border: message.role === 'ai' 
                  ? `1px solid ${modeColors[message.mode || 'real']}40` 
                  : 'none',
              }}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-gold" />
              ) : (
                <Bot 
                  className="w-4 h-4" 
                  style={{ color: modeColors[message.mode || 'real'] }} 
                />
              )}
            </div>

            <div
              className="glass-card rounded-xl px-4 py-3"
              style={{
                border: message.role === 'ai' 
                  ? `1px solid ${modeColors[message.mode || 'real']}30` 
                  : '1px solid rgba(184, 134, 11, 0.2)',
              }}
            >
              <p className="text-sm leading-relaxed font-serif" style={{ color: '#e8e0d0' }}>
                {message.content}
              </p>
              
              {message.role === 'ai' && message.mode && (
                <div 
                  className="mt-2 pt-2 flex items-center gap-1 text-xs font-serif"
                  style={{ 
                    borderTop: `1px solid ${modeColors[message.mode]}20`,
                    color: modeColors[message.mode],
                  }}
                >
                  <span className="uppercase tracking-wider">{message.mode} self</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {isThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(184, 134, 11, 0.2)',
              border: '1px solid rgba(184, 134, 11, 0.3)',
            }}
          >
            <Bot className="w-4 h-4 animate-pulse text-gold" />
          </div>
          <div className="glass-card rounded-xl px-4 py-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#b8860b' }}
                  animate={{ 
                    y: [0, -4, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
