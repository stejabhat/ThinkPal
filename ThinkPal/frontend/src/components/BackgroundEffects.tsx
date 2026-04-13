'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface Line {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);

    const newLines = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
    }));
    setLines(newLines);
  }, []);

  const particleStyles = useMemo(() => {
    return particles.map((particle) => ({
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: particle.size,
      height: particle.size,
      background: 'rgba(184, 134, 11, 0.4)',
      boxShadow: `0 0 ${particle.size * 2}px rgba(184, 134, 11, 0.3)`,
    }));
  }, [particles]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(107, 28, 35, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(30, 77, 64, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(184, 134, 11, 0.05) 0%, transparent 70%)
            `,
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(107, 28, 35, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(30, 77, 64, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(184, 134, 11, 0.05) 0%, transparent 70%)
          `,
        }}
      />

      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184, 134, 11, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184, 134, 11, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {particleStyles.map((style, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={style}
          animate={{
            y: [0, -80, -160],
            x: [0, 15, -15],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: particles[i]?.duration || 15,
            repeat: Infinity,
            delay: particles[i]?.delay || 0,
            ease: 'linear',
          }}
        />
      ))}

      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              delay: line.id * 1.5,
              ease: 'easeInOut',
            }}
          />
        ))}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#6b1c23" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(184, 134, 11, 0.02) 50%, transparent 100%)',
        }}
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 12, 16, 0.6) 100%)',
        }}
      />
    </div>
  );
}
