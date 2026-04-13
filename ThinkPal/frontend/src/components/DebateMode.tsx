'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Rewind, FastForward, Send, Plus, Loader2 } from 'lucide-react';

interface DebateModeProps {
  isActive: boolean;
  pastResponse: string;
  futureResponse: string;
  finalResponse: string;
  isThinking: boolean;
  onSend: (message: string) => void;
  onAddMemory: () => void;
}

export default function DebateMode({
  isActive,
  pastResponse,
  futureResponse,
  finalResponse,
  isThinking,
  onSend,
  onAddMemory,
}: DebateModeProps) {
  const [mounted, setMounted] = useState(false);
  const [skeletonWidths, setSkeletonWidths] = useState<number[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    setSkeletonWidths(Array.from({ length: 3 }, () => 60 + Math.random() * 40));
  }, []);

  const handleSend = () => {
    if (inputMessage.trim() && !isThinking) {
      onSend(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute inset-0 z-30 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 12, 16, 0.98) 0%, rgba(18, 21, 28, 0.99) 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 py-4 px-6 border-b elegant-border">
          <motion.div
            animate={{ scale: isThinking ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 rounded-full"
            style={{
              background: '#b8860b',
              boxShadow: '0 0 12px #b8860b',
            }}
          />
          <span className="text-sm font-serif font-medium tracking-[0.2em] uppercase text-gold">
            The Council Convenes
          </span>
          <motion.div
            animate={{ scale: isThinking ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 rounded-full"
            style={{
              background: '#b8860b',
              boxShadow: '0 0 12px #b8860b',
            }}
          />
        </div>

        {/* Split screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Past Self - Left */}
          <div className="flex-1 flex flex-col border-r elegant-border">
            <div className="flex items-center gap-2 p-4 border-b elegant-border">
              <Rewind className="w-5 h-5" style={{ color: '#6b1c23' }} />
              <span className="text-sm font-serif font-medium" style={{ color: '#6b1c23' }}>Past Self</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto scrollable">
              {isThinking && mounted ? (
                <div className="space-y-3">
                  {skeletonWidths.map((width, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="h-4 rounded"
                      style={{ background: 'rgba(107, 28, 35, 0.15)', width: `${width}%` }}
                    />
                  ))}
                </div>
              ) : pastResponse ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm leading-relaxed font-serif"
                  style={{ color: '#c9a0a5' }}
                >
                  {pastResponse}
                </motion.p>
              ) : (
                <p className="text-sm font-serif" style={{ color: '#6a665a' }}>Awaiting your query...</p>
              )}
            </div>
          </div>

          {/* VS */}
          <div className="w-20 flex items-center justify-center relative">
            <motion.div
              animate={{ 
                scale: isThinking ? [1, 1.5, 1] : 1,
                opacity: isThinking ? [0.3, 0.8, 0.3] : 0.3,
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle, rgba(184, 134, 11, 0.2) 0%, transparent 70%)',
              }}
            />
            <span 
              className="text-2xl font-serif font-bold text-gold"
              style={{ textShadow: '0 0 20px #b8860b' }}
            >
              VS
            </span>
          </div>

          {/* Future Self - Right */}
          <div className="flex-1 flex flex-col border-l elegant-border">
            <div className="flex items-center gap-2 p-4 border-b elegant-border">
              <FastForward className="w-5 h-5" style={{ color: '#1e4d40' }} />
              <span className="text-sm font-serif font-medium" style={{ color: '#1e4d40' }}>Future Self</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto scrollable">
              {isThinking && mounted ? (
                <div className="space-y-3">
                  {skeletonWidths.map((width, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="h-4 rounded"
                      style={{ background: 'rgba(30, 77, 64, 0.15)', width: `${width}%` }}
                    />
                  ))}
                </div>
              ) : futureResponse ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm leading-relaxed font-serif"
                  style={{ color: '#8ab8ad' }}
                >
                  {futureResponse}
                </motion.p>
              ) : (
                <p className="text-sm font-serif" style={{ color: '#6a665a' }}>Awaiting your query...</p>
              )}
            </div>
          </div>
        </div>

        {/* Synthesis */}
        <div 
          className="p-4 border-t elegant-border"
          style={{ 
            background: 'linear-gradient(180deg, rgba(184, 134, 11, 0.05) 0%, rgba(18, 21, 28, 0.8) 100%)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gold" />
            <span className="text-sm font-serif font-medium text-gold">Present Self — Synthesis</span>
          </div>
          {isThinking ? (
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-4 rounded"
              style={{ background: 'rgba(184, 134, 11, 0.15)', width: '80%' }}
            />
          ) : finalResponse ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm leading-relaxed font-serif"
              style={{ color: '#e8e0d0' }}
            >
              {finalResponse}
            </motion.p>
          ) : (
            <p className="text-sm font-serif" style={{ color: '#6a665a' }}>Present your question to the council...</p>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t elegant-border">
          <div className="glass-card rounded-xl p-2 flex items-center gap-2">
            <motion.button
              onClick={onAddMemory}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(107, 28, 35, 0.15)',
                border: '1px solid rgba(107, 28, 35, 0.2)',
              }}
              title="Add Memory"
            >
              <Plus className="w-5 h-5" style={{ color: '#6b1c23' }} />
            </motion.button>

            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Present your question to the council..."
              disabled={isThinking}
              className="flex-1 bg-transparent text-sm px-3 py-2 resize-none font-serif"
              style={{ color: '#e8e0d0' }}
              rows={1}
            />

            <motion.button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isThinking}
              whileHover={inputMessage.trim() && !isThinking ? { scale: 1.05 } : {}}
              whileTap={inputMessage.trim() && !isThinking ? { scale: 0.95 } : {}}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: inputMessage.trim() && !isThinking 
                  ? 'linear-gradient(135deg, #b8860b 0%, #8b6609 100%)' 
                  : 'rgba(184, 134, 11, 0.1)',
                border: inputMessage.trim() && !isThinking 
                  ? 'none' 
                  : '1px solid rgba(184, 134, 11, 0.2)',
                cursor: inputMessage.trim() && !isThinking ? 'pointer' : 'not-allowed',
              }}
            >
              {isThinking ? (
                <Loader2 className="w-5 h-5 animate-spin text-gold" />
              ) : (
                <Send 
                  className="w-5 h-5" 
                  style={{ color: inputMessage.trim() && !isThinking ? '#0a0c10' : '#6a665a' }} 
                />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
