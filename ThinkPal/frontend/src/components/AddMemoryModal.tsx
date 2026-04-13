'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, type: 'habit' | 'thought' | 'event') => Promise<void>;
}

const memoryTypes = [
  { id: 'habit', label: 'Habit', color: '#b8860b' },
  { id: 'thought', label: 'Thought', color: '#6b1c23' },
  { id: 'event', label: 'Event', color: '#1e4d40' },
] as const;

export default function AddMemoryModal({ isOpen, onClose, onSubmit }: AddMemoryModalProps) {
  const [text, setText] = useState('');
  const [type, setType] = useState<'habit' | 'thought' | 'event'>('thought');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(text.trim(), type);
      setText('');
      onClose();
    } catch (error) {
      console.error('Failed to add memory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(10, 12, 16, 0.85)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl w-full max-w-md p-6"
          style={{
            border: '1px solid rgba(184, 134, 11, 0.2)',
            boxShadow: '0 0 60px rgba(184, 134, 11, 0.15)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-medium" style={{ color: '#e8e0d0' }}>
              Record Memory
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: '#6a665a' }} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-serif" style={{ color: '#9a948a' }}>
              Memory Type
            </label>
            <div className="flex gap-2">
              {memoryTypes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setType(m.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-serif transition-all ${
                    type === m.id ? '' : 'hover:bg-white/5'
                  }`}
                  style={{
                    background: type === m.id ? `${m.color}25` : 'transparent',
                    border: `1px solid ${type === m.id ? m.color : 'transparent'}`,
                    color: type === m.id ? m.color : '#6a665a',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2 font-serif" style={{ color: '#9a948a' }}>
              Memory
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you wish to remember..."
              rows={4}
              className="w-full glass rounded-lg p-3 text-sm resize-none font-serif"
              style={{ 
                color: '#e8e0d0',
                background: 'rgba(20, 25, 35, 0.5)',
                border: '1px solid rgba(184, 134, 11, 0.1)',
              }}
            />
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            whileHover={text.trim() && !loading ? { scale: 1.02 } : {}}
            whileTap={text.trim() && !loading ? { scale: 0.98 } : {}}
            className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 font-serif"
            style={{
              background: text.trim() && !loading 
                ? 'linear-gradient(135deg, #b8860b 0%, #8b6609 100%)' 
                : 'rgba(184, 134, 11, 0.2)',
              color: text.trim() && !loading ? '#0a0c10' : '#6a665a',
              cursor: text.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Recording...</span>
              </>
            ) : (
              <span>Record Memory</span>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
