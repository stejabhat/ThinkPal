'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThoughtStreamProps {
  isThinking: boolean;
  currentMessage?: string;
}

interface Thought {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  timestamp: number;
}

const SYSTEM_THOUGHTS = [
  'Retrieving memory vectors...',
  'Querying neural embeddings...',
  'Synthesizing perspectives...',
  'Analyzing temporal patterns...',
  'Projecting future scenarios...',
  'Accessing episodic memory...',
  'Building semantic connections...',
  'Running inference...',
];

export default function ThoughtStream({ isThinking, currentMessage }: ThoughtStreamProps) {
  const [mounted, setMounted] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isThinking) {
      const randomThought = SYSTEM_THOUGHTS[Math.floor(Math.random() * SYSTEM_THOUGHTS.length)];
      setCurrentThought(randomThought);
    } else {
      setCurrentThought('');
    }
  }, [isThinking]);

  useEffect(() => {
    if (currentMessage) {
      const newThought: Thought = {
        id: Date.now().toString(),
        text: currentMessage.length > 50 ? currentMessage.slice(0, 50) + '...' : currentMessage,
        type: 'ai',
        timestamp: Date.now(),
      };
      setThoughts(prev => [newThought, ...prev].slice(0, 10));
    }
  }, [currentMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [thoughts]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return '#00f0ff';
      case 'ai': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Thought Stream
        </span>
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: isThinking ? '#22c55e' : '#64748b' }}
          animate={{ 
            scale: isThinking ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>

      {/* Current Thinking */}
      <AnimatePresence>
        {isThinking && currentThought && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 p-2 rounded-lg"
            style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="flex gap-0.5"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
              </motion.div>
              <span className="text-xs" style={{ color: '#8b5cf6' }}>
                {currentThought}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thought History */}
      <div 
        ref={scrollRef}
        className="space-y-2 max-h-32 overflow-y-auto scrollable"
      >
        {thoughts.length === 0 && !isThinking && (
          <p className="text-xs text-center py-4" style={{ color: '#475569' }}>
            Thoughts will appear here...
          </p>
        )}
        
        {thoughts.map((thought, i) => (
          <motion.div
            key={thought.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2"
          >
            <div 
              className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: getTypeColor(thought.type) }}
            />
            <p 
              className="text-xs leading-relaxed"
              style={{ color: i === 0 ? '#e2e8f0' : '#64748b' }}
            >
              {thought.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(100, 200, 255, 0.1)' }}>
        <button 
          className="flex-1 text-xs py-1.5 rounded"
          style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#3b82f6',
          }}
          onClick={() => setThoughts([])}
        >
          Clear
        </button>
        <button 
          className="flex-1 text-xs py-1.5 rounded"
          style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#8b5cf6',
          }}
          onClick={() => {
            const dump = JSON.stringify(thoughts, null, 2);
            console.log('Thought Stream:', dump);
            alert('Thoughts logged to console');
          }}
        >
          Export
        </button>
      </div>
    </div>
  );
}
