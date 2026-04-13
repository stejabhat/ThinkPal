'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ThoughtCoreProps {
  isThinking: boolean;
  mode: 'real' | 'past' | 'future' | 'debate';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface LinePoint {
  id: number;
  x2: number;
  y2: number;
}

export default function ThoughtCore({ isThinking, mode }: ThoughtCoreProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  const linePoints = useMemo<LinePoint[]>(() => {
    return [0, 1, 2, 3, 4, 5].map((i) => ({
      id: i,
      x2: 50 + Math.cos((i * 60 * Math.PI) / 180) * 40,
      y2: 50 + Math.sin((i * 60 * Math.PI) / 180) * 40,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const getModeColor = () => {
    switch (mode) {
      case 'past': return '#6b1c23';
      case 'future': return '#1e4d40';
      case 'debate': return '#4a3728';
      default: return '#b8860b';
    }
  };

  const modeColor = getModeColor();

  if (!mounted) {
    return (
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute w-56 h-56 rounded-full elegant-border-gold" />
        <div className="absolute w-40 h-40 rounded-full elegant-border" />
        <div 
          className="relative w-24 h-24 rounded-full" 
          style={{ 
            background: 'radial-gradient(circle at 30% 30%, #d4a84380, #b8860b40 50%, #b8860b10 80%)',
            boxShadow: '0 0 30px #b8860b60',
          }} 
        />
      </div>
    );
  }

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: modeColor,
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, particle.x],
            y: [0, particle.y],
            opacity: [0, isThinking ? 0.8 : 0.3, 0],
            scale: [1, isThinking ? 2 : 0.5],
          }}
          transition={{
            duration: isThinking ? 2 : 3,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.div
        className="absolute w-56 h-56 rounded-full"
        style={{ border: `2px solid ${modeColor}30` }}
        animate={{
          scale: isThinking ? [1, 1.1, 1] : 1,
          opacity: isThinking ? [0.3, 0.6, 0.3] : 0.3,
          boxShadow: isThinking ? `0 0 30px ${modeColor}40, 0 0 60px ${modeColor}20` : `0 0 20px ${modeColor}20`,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{ border: `2px solid ${modeColor}50` }}
        animate={{
          scale: isThinking ? [1, 1.05, 1] : 1,
          opacity: isThinking ? [0.5, 0.8, 0.5] : 0.4,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${modeColor}80, ${modeColor}40 50%, ${modeColor}10 80%)`,
          boxShadow: `0 0 30px ${modeColor}60, inset 0 0 20px ${modeColor}40`,
        }}
        animate={{
          scale: isThinking ? [1, 1.1, 1] : [0.95, 1],
          boxShadow: isThinking
            ? `0 0 50px ${modeColor}80, 0 0 80px ${modeColor}40, inset 0 0 30px ${modeColor}60`
            : `0 0 30px ${modeColor}60, inset 0 0 20px ${modeColor}40`,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute w-8 h-8 rounded-full blur-xl" style={{ backgroundColor: '#f5f0e6', top: '20%', left: '20%', opacity: 0.6 }} />
      </motion.div>

      <svg className="absolute w-full h-full" style={{ opacity: 0.3 }}>
        {linePoints.map((point) => (
          <motion.line
            key={point.id}
            x1="50%"
            y1="50%"
            x2={`${point.x2}%`}
            y2={`${point.y2}%`}
            stroke={modeColor}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isThinking ? [0, 1, 0] : 0,
              opacity: isThinking ? [0, 0.8, 0] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity, delay: point.id * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      <motion.div
        className="absolute -bottom-12 text-xs tracking-[0.3em] uppercase font-serif"
        style={{ color: modeColor, textShadow: `0 0 10px ${modeColor}` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isThinking ? 'Contemplating' : 'Mind'}
      </motion.div>
    </div>
  );
}
