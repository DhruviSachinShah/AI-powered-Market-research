import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AvatarState } from '../../types';

interface BrainAnimationProps {
  avatarState: AvatarState;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface NeuralConnection {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  pulse: number;
}

const BrainAnimation: React.FC<BrainAnimationProps> = ({ avatarState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  // Removed unused particles state - using particlesRef instead
  const [neuralConnections, setNeuralConnections] = useState<NeuralConnection[]>([]);
  const [brainNodes, setBrainNodes] = useState<Array<{ x: number; y: number; size: number; pulse: number }>>([]);

  // Initialize brain nodes (neural network structure)
  useEffect(() => {
    const nodes = [
      { x: 0.3, y: 0.2, size: 0.08, pulse: 0 },
      { x: 0.7, y: 0.3, size: 0.06, pulse: 0 },
      { x: 0.2, y: 0.5, size: 0.07, pulse: 0 },
      { x: 0.8, y: 0.6, size: 0.05, pulse: 0 },
      { x: 0.4, y: 0.7, size: 0.09, pulse: 0 },
      { x: 0.6, y: 0.8, size: 0.06, pulse: 0 },
      { x: 0.5, y: 0.4, size: 0.1, pulse: 0 }, // Central node
    ];
    setBrainNodes(nodes);
  }, []);

  // Generate neural connections
  useEffect(() => {
    const connections: NeuralConnection[] = [];
    for (let i = 0; i < brainNodes.length; i++) {
      for (let j = i + 1; j < brainNodes.length; j++) {
        if (Math.random() > 0.6) { // 40% chance of connection
          connections.push({
            id: connections.length,
            x1: brainNodes[i].x,
            y1: brainNodes[i].y,
            x2: brainNodes[j].x,
            y2: brainNodes[j].y,
            opacity: 0.3,
            pulse: 0
          });
        }
      }
    }
    setNeuralConnections(connections);
  }, [brainNodes]);

  // Generate particles based on state
  useEffect(() => {
    const newParticles: Particle[] = [];
    const particleCount = avatarState.isSpeaking ? 25 : avatarState.isListening ? 15 : 8;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: avatarState.isSpeaking 
          ? `hsl(${200 + Math.random() * 60}, 70%, 60%)` // Blue to cyan
          : avatarState.isListening 
          ? `hsl(${300 + Math.random() * 60}, 70%, 60%)` // Purple to pink
          : `hsl(${180 + Math.random() * 40}, 50%, 50%)` // Teal to blue
      });
    }
    // Update particles ref directly
    particlesRef.current = newParticles; // Update ref for animation loop
  }, [avatarState.isSpeaking, avatarState.isListening]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const width = rect.width;
      const height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw brain outline
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = avatarState.isSpeaking 
        ? 'rgba(59, 130, 246, 0.1)' 
        : avatarState.isListening 
        ? 'rgba(168, 85, 247, 0.1)' 
        : 'rgba(148, 163, 184, 0.1)';
      ctx.fill();
      ctx.strokeStyle = avatarState.isSpeaking 
        ? 'rgba(59, 130, 246, 0.3)' 
        : avatarState.isListening 
        ? 'rgba(168, 85, 247, 0.3)' 
        : 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw neural connections
      neuralConnections.forEach(connection => {
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2 + connection.id) * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.moveTo(connection.x1 * width, connection.y1 * height);
        ctx.lineTo(connection.x2 * width, connection.y2 * height);
        ctx.strokeStyle = avatarState.isSpeaking 
          ? `rgba(59, 130, 246, ${0.2 + pulse * 0.3})` 
          : avatarState.isListening 
          ? `rgba(168, 85, 247, ${0.2 + pulse * 0.3})` 
          : `rgba(148, 163, 184, ${0.1 + pulse * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw brain nodes
      brainNodes.forEach((node, index) => {
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 3 + index) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(node.x * width, node.y * height, node.size * Math.min(width, height) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = avatarState.isSpeaking 
          ? `rgba(59, 130, 246, ${0.6 + pulse * 0.4})` 
          : avatarState.isListening 
          ? `rgba(168, 85, 247, ${0.6 + pulse * 0.4})` 
          : `rgba(148, 163, 184, ${0.4 + pulse * 0.3})`;
        ctx.fill();
        
        // Node glow effect
        ctx.beginPath();
        ctx.arc(node.x * width, node.y * height, node.size * Math.min(width, height) * pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = avatarState.isSpeaking 
          ? `rgba(59, 130, 246, ${0.1 + pulse * 0.2})` 
          : avatarState.isListening 
          ? `rgba(168, 85, 247, ${0.1 + pulse * 0.2})` 
          : `rgba(148, 163, 184, ${0.05 + pulse * 0.1})`;
        ctx.fill();
      });

      // Update and draw particles (using ref to avoid infinite loop)
      particlesRef.current = particlesRef.current.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        // Bounce off edges
        if (newX <= 0 || newX >= 1) particle.vx *= -1;
        if (newY <= 0 || newY >= 1) particle.vy *= -1;

        // Keep particles in bounds
        newX = Math.max(0, Math.min(1, newX));
        newY = Math.max(0, Math.min(1, newY));

        // Draw particle
        ctx.beginPath();
        ctx.arc(newX * width, newY * height, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        return {
          ...particle,
          x: newX,
          y: newY
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [avatarState, neuralConnections, brainNodes]); // Removed particles from dependencies

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Main brain animation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Central AI indicator */}
      <motion.div
        animate={{
          scale: avatarState.isSpeaking ? [1, 1.2, 1] : avatarState.isListening ? [1, 1.1, 1] : 1,
          opacity: avatarState.isSpeaking ? [0.8, 1, 0.8] : avatarState.isListening ? [0.9, 1, 0.9] : 0.7,
        }}
        transition={{
          duration: avatarState.isSpeaking ? 0.8 : avatarState.isListening ? 1.2 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
             style={{
               background: avatarState.isSpeaking 
                 ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' 
                 : avatarState.isListening 
                 ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
                 : 'linear-gradient(135deg, #94a3b8, #64748b)'
             }}
        >
          <motion.div
            animate={{
              rotate: avatarState.isSpeaking ? 360 : avatarState.isListening ? 180 : 0,
            }}
            transition={{
              duration: avatarState.isSpeaking ? 2 : avatarState.isListening ? 3 : 0,
              repeat: avatarState.isSpeaking ? Infinity : avatarState.isListening ? Infinity : 0,
              ease: "linear"
            }}
            className="text-white text-2xl"
          >
            🧠
          </motion.div>
        </div>
      </motion.div>

      {/* Thinking indicators */}
      <motion.div
        animate={{
          opacity: avatarState.isSpeaking ? [0, 1, 0] : avatarState.isListening ? [0, 0.8, 0] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full shadow-md"
        style={{
          background: avatarState.isSpeaking 
            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' 
            : avatarState.isListening 
            ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
            : 'transparent',
          color: 'white'
        }}
      >
        {avatarState.isSpeaking ? '🤖 Processing...' : avatarState.isListening ? '👂 Analyzing...' : ''}
      </motion.div>

      {/* Data streams */}
      {avatarState.isSpeaking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: Math.random() * 100 + '%', y: '100%' }}
              animate={{ y: '-10%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear"
              }}
              className="absolute w-1 h-8 rounded-full"
              style={{
                background: `linear-gradient(to top, transparent, hsl(${200 + i * 20}, 70%, 60%))`,
                left: `${20 + i * 12}%`
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BrainAnimation;
