'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface PersonalityScopeProps {
  mode: string;
  messageCount: number;
  isThinking: boolean;
}

interface Trait {
  name: string;
  value: number;
  color: string;
}

export default function PersonalityScope({ mode, messageCount, isThinking }: PersonalityScopeProps) {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<number[][]>([]);

  const traits = useMemo<Trait[]>(() => {
    const base = 50;
    const modeMod = mode === 'past' ? -15 : mode === 'future' ? 15 : 0;
    const activityMod = Math.min(30, messageCount * 2);
    
    return [
      { name: 'Rational', value: Math.min(100, base + modeMod + activityMod), color: '#3b82f6' },
      { name: 'Emotional', value: Math.min(100, base - modeMod + activityMod * 0.5), color: '#ff4444' },
      { name: 'Intuitive', value: Math.min(100, base + 10 + activityMod * 0.8), color: '#8b5cf6' },
      { name: 'Logical', value: Math.min(100, base + modeMod * 0.5 + activityMod * 0.3), color: '#00f0ff' },
      { name: 'Creative', value: Math.min(100, base + 20 + (mode === 'future' ? 20 : 0)), color: '#22c55e' },
      { name: 'Impulsive', value: Math.min(100, base + (mode === 'past' ? 25 : -10) + messageCount), color: '#ff6b35' },
    ];
  }, [mode, messageCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isThinking) {
      const values = traits.map(t => t.value);
      setHistory(prev => [...prev.slice(-19), values]);
    }
  }, [isThinking, traits]);

  const getTraitLabel = (value: number) => {
    if (value < 30) return 'Low';
    if (value < 70) return 'Balanced';
    return 'High';
  };

  if (!mounted) {
    return (
      <div className="glass-card rounded-xl p-4 h-64">
        <div className="text-xs uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>
          Personality Scope
        </div>
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-4 rounded" style={{ background: 'rgba(100, 200, 255, 0.1)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Personality Scope
        </span>
        <div className="flex gap-1">
          {history.length > 5 && (
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Mini Oscilloscope */}
      <div className="h-12 mb-3 relative rounded overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="rgba(100, 200, 255, 0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Waveform */}
          {history.length > 1 && traits.map((trait, ti) => {
            const points = history.map((h, hi) => {
              const x = (hi / (history.length - 1)) * 100;
              const y = 100 - (h[ti] / 100) * 100;
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <polyline
                key={trait.name}
                points={points}
                fill="none"
                stroke={trait.color}
                strokeWidth="1.5"
                opacity="0.8"
              />
            );
          })}
        </svg>

        {/* Scan line */}
        {isThinking && (
          <motion.div
            className="absolute top-0 bottom-0 w-0.5"
            style={{ background: 'rgba(139, 92, 246, 0.5)' }}
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      {/* Traits bars */}
      <div className="space-y-2">
        {traits.map((trait, i) => (
          <motion.div
            key={trait.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: trait.color }}>{trait.name}</span>
              <span className="text-xs" style={{ color: '#64748b' }}>{getTraitLabel(trait.value)}</span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ 
                  background: trait.color,
                  boxShadow: `0 0 8px ${trait.color}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${trait.value}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
              {/* Target marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5"
                style={{ 
                  left: `${trait.value}%`,
                  background: '#fff',
                  opacity: 0.5,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mode indicator */}
      <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(100, 200, 255, 0.1)' }}>
        <span className="text-xs" style={{ color: '#64748b' }}>Active Mode:</span>
        <span className="text-xs font-medium uppercase" style={{ 
          color: mode === 'past' ? '#ff4444' : mode === 'future' ? '#00f0ff' : '#3b82f6',
        }}>
          {mode} you
        </span>
      </div>
    </div>
  );
}
