'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MemoryDNAProps {
  memories: { id: string; type: string; text: string }[];
  isThinking: boolean;
}

interface DNAPair {
  id: string;
  type: 'A' | 'T' | 'G' | 'C';
  color: string;
  memory?: string;
}

const DNA_COLORS: Record<string, string> = {
  A: '#ff4444',
  T: '#00f0ff',
  G: '#8b5cf6',
  C: '#22c55e',
};

const TYPE_TO_DNA: Record<string, string> = {
  habit: 'ATCG',
  thought: 'GCTA',
  event: 'TACG',
};

export default function MemoryDNA({ memories, isThinking }: MemoryDNAProps) {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);

  const dnaSequence = useMemo<DNAPair[]>(() => {
    const base: DNAPair[] = ['MINI', 'YOU', 'AI'].flatMap(word => 
      word.split('').map((char, i) => ({
        id: `base-${Math.random()}`,
        type: char as 'A' | 'T' | 'G' | 'C',
        color: DNA_COLORS[char] || '#8b5cf6',
      }))
    );

    const memoryDNA = memories.slice(0, 20).map((mem, i) => {
      const dnaType = TYPE_TO_DNA[mem.type] || 'ATCG';
      return dnaType.split('').map((char, j) => ({
        id: `${mem.id}-${j}`,
        type: char as 'A' | 'T' | 'G' | 'C',
        color: DNA_COLORS[char] || '#8b5cf6',
        memory: mem.text.slice(0, 20),
      }));
    }).flat();

    return [...base, ...memoryDNA];
  }, [memories]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setRotation(prev => prev + 2);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  const getUniqueness = () => {
    const entropy = memories.length * 12.5;
    return Math.min(100, entropy + Math.random() * 10);
  };

  if (!mounted) {
    return (
      <div className="glass-card rounded-xl p-4 h-48 flex items-center justify-center">
        <div className="w-8 h-24 rounded-full border-2 border-dashed" style={{ borderColor: '#8b5cf630' }} />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Memory DNA
        </span>
        <div className="flex gap-1">
          {['A', 'T', 'G', 'C'].map(base => (
            <div
              key={base}
              className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{ 
                background: `${DNA_COLORS[base]}30`,
                border: `1px solid ${DNA_COLORS[base]}`,
                color: DNA_COLORS[base],
              }}
            >
              {base}
            </div>
          ))}
        </div>
      </div>

      {/* DNA Helix Visualization */}
      <div className="relative h-32 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: isThinking ? rotation : 0 }}
          transition={{ duration: 0.1 }}
          style={{ transformStyle: 'preserve-3d', perspective: '500px' }}
          className="relative"
        >
          {/* DNA Strands */}
          {[-1, 1].map(side => (
            <motion.div
              key={side}
              className="absolute"
              style={{
                width: 2,
                height: '100%',
                left: '50%',
                marginLeft: -1,
                background: side === -1 ? '#ff444430' : '#00f0ff30',
                transform: `rotateZ(${side * 15}deg)`,
              }}
            />
          ))}

          {/* Base Pairs */}
          {dnaSequence.slice(0, 16).map((pair, i) => (
            <motion.div
              key={pair.id}
              className="absolute flex items-center"
              style={{
                top: `${(i / 16) * 100}%`,
                left: '50%',
                width: 60,
                marginLeft: -30,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              {/* Left strand */}
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ 
                  background: pair.color,
                  boxShadow: `0 0 6px ${pair.color}`,
                }}
              />
              
              {/* Connection */}
              <div 
                className="flex-1 h-0.5"
                style={{ 
                  background: `linear-gradient(90deg, ${pair.color}50, ${pair.color}50)`,
                }}
              />
              
              {/* Right strand */}
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ 
                  background: pair.color,
                  boxShadow: `0 0 6px ${pair.color}`,
                  opacity: 0.6,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Glow effect when thinking */}
        {isThinking && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(100, 200, 255, 0.1)' }}>
        <div>
          <span className="text-xs" style={{ color: '#64748b' }}>Genes:</span>
          <span className="text-xs ml-1" style={{ color: '#8b5cf6' }}>{dnaSequence.length}</span>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#64748b' }}>Uniqueness:</span>
          <span className="text-xs ml-1" style={{ color: '#22c55e' }}>{getUniqueness().toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
