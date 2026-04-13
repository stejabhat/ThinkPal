'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface BrainStateProps {
  isThinking: boolean;
  mode: string;
  messageCount: number;
}

type BrainState = 'idle' | 'active' | 'reflective' | 'processing' | 'dreaming';

const stateConfig: Record<BrainState, { label: string; color: string; description: string }> = {
  idle: { label: 'Resting', color: '#6a665a', description: 'Awaiting your words' },
  active: { label: 'Engaged', color: '#b8860b', description: 'Processing thoughts' },
  reflective: { label: 'Remembering', color: '#6b1c23', description: 'Past echoes within' },
  processing: { label: 'Consulting', color: '#9a7209', description: 'Seeking wisdom' },
  dreaming: { label: 'Envisioning', color: '#1e4d40', description: 'Future unfolds' },
};

export default function BrainState({ isThinking, mode, messageCount }: BrainStateProps) {
  const [mounted, setMounted] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const brainState = useMemo<BrainState>(() => {
    if (isThinking) return 'processing';
    if (mode === 'future') return 'dreaming';
    if (mode === 'past') return 'reflective';
    if (messageCount > 5) return 'active';
    return 'idle';
  }, [isThinking, mode, messageCount]);

  const config = stateConfig[brainState];
  const amplitude = isThinking ? 25 : 8;

  return (
    <div className="glass-card rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider font-serif" style={{ color: '#6a665a' }}>
          Mind State
        </span>
        <motion.div
          animate={{ scale: isThinking ? [1, 1.3, 1] : 1 }}
          transition={{ duration: isThinking ? 0.5 : 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full"
          style={{ background: config.color, boxShadow: `0 0 8px ${config.color}` }}
        />
      </div>

      <div className="h-10 flex items-center justify-center gap-0.5 mb-2">
        {mounted && Array.from({ length: 24 }).map((_, i) => {
          const offset = Math.abs(pulsePhase - i * 4) % 50;
          const height = Math.max(3, amplitude - offset * 0.4);
          const opacity = Math.max(0.2, 1 - offset / 50);
          return (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ height, background: config.color, opacity }}
            />
          );
        })}
      </div>

      <div className="text-center">
        <motion.span
          className="text-sm font-serif font-medium"
          style={{ color: config.color, textShadow: `0 0 10px ${config.color}50` }}
        >
          {config.label}
        </motion.span>
        <p className="text-xs font-serif mt-0.5" style={{ color: '#4a4640' }}>{config.description}</p>
      </div>
    </div>
  );
}
