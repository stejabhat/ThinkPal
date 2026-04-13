'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThoughtCore from '@/components/ThoughtCore';
import MemoryStream from '@/components/MemoryStream';
import PersonalityEngine from '@/components/PersonalityEngine';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import DebateMode from '@/components/DebateMode';
import AddMemoryModal from '@/components/AddMemoryModal';
import BackgroundEffects from '@/components/BackgroundEffects';
import BrainState from '@/components/BrainState';
import MindSync from '@/components/MindSync';
import ThoughtStream from '@/components/ThoughtStream';
import PersonalityScope from '@/components/PersonalityScope';
import MemoryDNA from '@/components/MemoryDNA';
import { sendChat, sendDebate, addMemory, getAllMemories, Memory } from '@/lib/api';

type Mode = 'real' | 'past' | 'future' | 'debate';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mode?: 'real' | 'past' | 'future';
  memories?: Memory[];
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('real');
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [debateMode, setDebateMode] = useState(false);
  const [pastResponse, setPastResponse] = useState('');
  const [futureResponse, setFutureResponse] = useState('');
  const [finalResponse, setFinalResponse] = useState('');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await getAllMemories();
      setMemories(data.memories);
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    if (newMode === 'debate') {
      setDebateMode(true);
      setMode('debate');
    } else {
      setDebateMode(false);
      setMode(newMode);
    }
  };

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    if (mode === 'debate' || debateMode) {
      await handleDebate(message);
    } else {
      await handleChat(message);
    }
  };

  const handleChat = async (message: string) => {
    setIsThinking(true);
    try {
      const response = await sendChat({ message, mode: mode === 'debate' ? 'real' : mode });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.response,
        timestamp: new Date(),
        mode: mode === 'debate' ? 'real' : (mode as 'real' | 'past' | 'future'),
        memories: response.memories_used,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleDebate = async (message: string) => {
    setIsThinking(true);
    setPastResponse('');
    setFutureResponse('');
    setFinalResponse('');
    
    try {
      const response = await sendDebate({ message });
      setPastResponse(response.past_you);
      setFutureResponse(response.future_you);
      setFinalResponse(response.final_answer);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: response.final_answer,
          timestamp: new Date(),
          mode: 'real',
          memories: response.memories_used,
        },
      ]);
    } catch (error) {
      console.error('Failed to start debate:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAddMemory = async (text: string, type: 'habit' | 'thought' | 'event') => {
    try {
      await addMemory({ text, type });
      await loadMemories();
    } catch (error) {
      console.error('Failed to add memory:', error);
      throw error;
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: '#030712' }}>
      <BackgroundEffects />

      {/* Left Panel */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-80 h-full flex flex-col p-4 relative z-10"
        style={{ borderRight: '1px solid rgba(100, 200, 255, 0.1)' }}
      >
        <div className="glass-card rounded-xl flex-1 overflow-hidden">
          <div className="h-full p-4">
            <MemoryStream memories={memories} loading={false} />
          </div>
        </div>
      </motion.aside>

      {/* Center Panel */}
      <main className="flex-1 flex flex-col relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <ThoughtCore isThinking={isThinking} mode={mode} />
          </motion.div>
        </div>

        <div className="h-[400px] flex flex-col">
          <ChatMessages messages={messages} isThinking={isThinking} />
        </div>

        {!debateMode && (
          <div className="relative z-40">
            <ChatInput
              onSend={handleSend}
              onAddMemory={() => setShowAddMemory(true)}
              isThinking={isThinking}
            />
          </div>
        )}

        <DebateMode
          isActive={debateMode}
          pastResponse={pastResponse}
          futureResponse={futureResponse}
          finalResponse={finalResponse}
          isThinking={isThinking}
          onSend={handleSend}
          onAddMemory={() => setShowAddMemory(true)}
        />
      </main>

      {/* Right Panel */}
      <motion.aside
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-80 h-full flex flex-col p-4 relative z-10"
        style={{ borderLeft: '1px solid rgba(100, 200, 255, 0.1)' }}
      >
        <div className="glass-card rounded-xl flex-1 overflow-hidden">
          <div className="h-full p-4 overflow-y-auto scrollable">
            <PersonalityEngine
              currentMode={mode}
              onModeChange={handleModeChange}
              disabled={isThinking}
            />

            {/* X-Factors - Compact Cards */}
            <div className="mt-4 space-y-3">
              <div className="glass-card rounded-lg p-3">
                <BrainState isThinking={isThinking} mode={mode} messageCount={messages.length} />
              </div>
              
              <div className="glass-card rounded-lg p-3">
                <MindSync mode={mode} isThinking={isThinking} memories={memories} />
              </div>
              
              <div className="glass-card rounded-lg p-3">
                <ThoughtStream isThinking={isThinking} currentMessage={messages[messages.length - 1]?.content} />
              </div>
              
              <div className="glass-card rounded-lg p-3">
                <PersonalityScope mode={mode} messageCount={messages.length} isThinking={isThinking} />
              </div>
              
              <div className="glass-card rounded-lg p-3">
                <MemoryDNA memories={memories} isThinking={isThinking} />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      <AddMemoryModal
        isOpen={showAddMemory}
        onClose={() => setShowAddMemory(false)}
        onSubmit={handleAddMemory}
      />
    </div>
  );
}
