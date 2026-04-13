'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, Zap } from 'lucide-react';
import { Memory } from '@/lib/api';

interface MemoryStreamProps {
  memories: Memory[];
  loading?: boolean;
}

const typeColors: Record<string, string> = {
  habit: '#b8860b',
  thought: '#6b1c23',
  event: '#1e4d40',
};

const typeLabels: Record<string, string> = {
  habit: 'habit',
  thought: 'thought',
  event: 'event',
};

export default function MemoryStream({ memories, loading }: MemoryStreamProps) {
  const [mounted, setMounted] = useState(false);
  const [particlePositions, setParticlePositions] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    setParticlePositions(Array.from({ length: 5 }, () => Math.random() * 100));
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Brain className="w-5 h-5 text-gold" />
        <span className="text-sm font-medium tracking-[0.2em] uppercase text-gold">
          Archives
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollable space-y-3 px-2">
        <AnimatePresence mode="popLayout">
          {memories.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm" style={{ color: '#6a665a' }}>
                No archives yet.
              </p>
              <p className="text-xs mt-1" style={{ color: '#4a4640' }}>
                Record your memories to build wisdom.
              </p>
            </motion.div>
          )}

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: [0.3, 0.6, 0.3], x: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="glass-card rounded-lg p-3"
                >
                  <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(184, 134, 11, 0.15)' }} />
                  <div className="h-3 w-1/2 rounded mt-2" style={{ background: 'rgba(184, 134, 11, 0.08)' }} />
                </motion.div>
              ))}
            </div>
          )}

          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.05 }}
              className="glass-card rounded-lg p-3 cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ borderLeft: `3px solid ${typeColors[memory.type] || '#b8860b'}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-serif"
                  style={{
                    background: `${typeColors[memory.type]}20`,
                    color: typeColors[memory.type],
                  }}
                >
                  {typeLabels[memory.type] || memory.type}
                </span>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#6a665a' }}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(memory.timestamp)}</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed font-serif" style={{ color: '#e8e0d0' }}>
                {memory.text.length > 100 ? memory.text.substring(0, 100) + '...' : memory.text}
              </p>

              {memory.distance !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-3 h-3 text-gold" />
                  <span className="text-xs text-gold">{((1 - memory.distance) * 100).toFixed(0)}% relevance</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: '#b8860b', left: `${pos}%` }}
              animate={{ y: [0, -100], opacity: [0, 0.5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
