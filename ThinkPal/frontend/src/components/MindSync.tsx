'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MindSyncProps {
  mode: string;
  isThinking: boolean;
  memories: { id: string; type: string }[];
}

interface Node {
  id: string;
  type: 'core' | 'past' | 'future' | 'memory';
  x: number;
  y: number;
  label: string;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

const NODE_COLORS: Record<string, string> = {
  core: '#3b82f6',
  past: '#ff4444',
  future: '#00f0ff',
  memory: '#8b5cf6',
};

export default function MindSync({ mode, isThinking, memories }: MindSyncProps) {
  const [mounted, setMounted] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  const nodes: Node[] = useMemo(() => {
    const baseNodes: Node[] = [
      { id: 'core', type: 'core', x: 50, y: 50, label: 'CORE' },
    ];

    if (mode === 'past' || mode === 'debate') {
      baseNodes.push({ id: 'past', type: 'past', x: 20, y: 50, label: 'PAST' });
    }
    if (mode === 'future' || mode === 'debate') {
      baseNodes.push({ id: 'future', type: 'future', x: 80, y: 50, label: 'FUTURE' });
    }

    memories.slice(0, 6).forEach((m, i) => {
      const angle = (i * 60 + 30) * (Math.PI / 180);
      const radius = 35;
      baseNodes.push({
        id: `mem-${m.id}`,
        type: 'memory',
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        label: m.type.slice(0, 1).toUpperCase(),
      });
    });

    return baseNodes;
  }, [mode, memories]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        setActiveNode(randomNode.id);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setActiveNode(null);
    }
  }, [isThinking, nodes]);

  useEffect(() => {
    const newConnections: Connection[] = [];
    nodes.forEach(node => {
      if (node.id !== 'core') {
        newConnections.push({
          from: 'core',
          to: node.id,
          strength: node.id === activeNode ? 1 : 0.3,
          active: node.id === activeNode || isThinking,
        });
      }
    });
    setConnections(newConnections);
  }, [activeNode, isThinking, nodes]);

  if (!mounted) {
    return (
      <div className="glass-card rounded-xl p-4 h-64 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-2 border-dashed" style={{ borderColor: '#3b82f630' }} />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Mind Sync
        </span>
        <div className="flex gap-1">
          {nodes.filter(n => n.type !== 'memory').map(n => (
            <motion.div
              key={n.id}
              className="w-2 h-2 rounded-full"
              style={{ 
                background: NODE_COLORS[n.type],
                opacity: activeNode === n.id ? 1 : 0.4,
              }}
              animate={{ 
                scale: activeNode === n.id ? [1, 1.5, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div className="relative h-48">
        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
          {/* Connections */}
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.line
                key={`${conn.from}-${conn.to}`}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={NODE_COLORS[toNode.type]}
                strokeWidth={conn.active ? 2 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 1],
                  opacity: [0, conn.strength, conn.strength],
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.1,
                }}
                style={{
                  filter: conn.active ? `drop-shadow(0 0 3px ${NODE_COLORS[toNode.type]})` : 'none',
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.g key={node.id}>
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.type === 'core' ? 20 : node.type === 'memory' ? 8 : 15}
                fill={`${NODE_COLORS[node.type]}${activeNode === node.id ? 'ff' : '40'}`}
                stroke={NODE_COLORS[node.type]}
                strokeWidth={activeNode === node.id ? 2 : 1}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isThinking && activeNode === node.id && (
                  <animate
                    attributeName="r"
                    values={`${node.type === 'core' ? 20 : 15};${(node.type === 'core' ? 25 : 18)};${node.type === 'core' ? 20 : 15}`}
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                )}
              </motion.circle>
              <text
                x={`${node.x}%`}
                y={`${node.y}%`}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[8px] fill-white font-bold"
                style={{ 
                  fill: '#fff',
                  fontSize: node.type === 'core' ? 8 : 6,
                }}
              >
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>

        {/* Pulse Effect */}
        {isThinking && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 100,
              height: 100,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${NODE_COLORS.core}40 0%, transparent 70%)`,
            }}
            animate={{
              scale: [0.5, 1.5],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </div>

      {/* Sync Status */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t" style={{ borderColor: 'rgba(100, 200, 255, 0.1)' }}>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: isThinking ? '#22c55e' : '#64748b' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs" style={{ color: '#64748b' }}>
            {isThinking ? 'Syncing' : 'Idle'}
          </span>
        </div>
        <span className="text-xs" style={{ color: '#64748b' }}>
          {nodes.length} nodes active
        </span>
      </div>
    </div>
  );
}
