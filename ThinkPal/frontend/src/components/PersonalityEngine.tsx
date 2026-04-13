'use client';

import { motion } from 'framer-motion';
import { User, Rewind, FastForward, Swords } from 'lucide-react';

type Mode = 'real' | 'past' | 'future' | 'debate';

interface PersonalityEngineProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  disabled?: boolean;
}

const modes: { id: Mode; label: string; icon: typeof User; color: string; description: string }[] = [
  {
    id: 'real',
    label: 'Present Self',
    icon: User,
    color: '#b8860b',
    description: 'Your current being',
  },
  {
    id: 'past',
    label: 'Past Self',
    icon: Rewind,
    color: '#6b1c23',
    description: 'Who you were',
  },
  {
    id: 'future',
    label: 'Future Self',
    icon: FastForward,
    color: '#1e4d40',
    description: 'Who you shall become',
  },
  {
    id: 'debate',
    label: 'Council',
    icon: Swords,
    color: '#4a3728',
    description: 'Three selves convene',
  },
];

export default function PersonalityEngine({ currentMode, onModeChange, disabled }: PersonalityEngineProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 px-2">
        <User className="w-5 h-5 text-gold" />
        <span className="text-sm font-medium tracking-[0.2em] uppercase text-gold">
          Persona
        </span>
      </div>

      <div className="flex flex-col gap-3 px-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              disabled={disabled}
              className="relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${mode.color}25, transparent)`,
                    boxShadow: `0 0 20px ${mode.color}30`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div
                className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? '' : 'hover:bg-white/5'}`}
                style={{
                  background: isActive ? 'rgba(20, 25, 35, 0.6)' : 'transparent',
                  border: `1px solid ${isActive ? mode.color + '50' : 'transparent'}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${mode.color}20`,
                    boxShadow: isActive ? `0 0 15px ${mode.color}40` : 'none',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: mode.color }} />
                </div>

                <div className="flex-1 text-left">
                  <motion.span
                    className="block text-sm font-serif font-medium"
                    style={{
                      color: isActive ? mode.color : '#9a948a',
                      textShadow: isActive ? `0 0 10px ${mode.color}` : 'none',
                    }}
                  >
                    {mode.label}
                  </motion.span>
                  <span className="block text-xs font-serif" style={{ color: '#6a665a' }}>
                    {mode.description}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: mode.color, boxShadow: `0 0 10px ${mode.color}` }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto p-4">
        <div className="glass-card rounded-lg p-3 elegant-border">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: modes.find(m => m.id === currentMode)?.color || '#b8860b',
                boxShadow: `0 0 10px ${modes.find(m => m.id === currentMode)?.color || '#b8860b'}`,
              }}
            />
            <span className="text-xs uppercase tracking-wider font-serif" style={{ color: '#6a665a' }}>
              Current State
            </span>
          </div>
          <p className="text-sm font-serif" style={{ color: '#e8e0d0' }}>
            {currentMode === 'debate'
              ? 'The council is in session'
              : currentMode === 'real'
              ? 'Present self is active'
              : currentMode === 'past'
              ? 'Past memories guide us'
              : 'Future visions unfold'}
          </p>
        </div>
      </div>
    </div>
  );
}
