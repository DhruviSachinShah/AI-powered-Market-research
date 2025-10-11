import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import type { AvatarState } from '../../types';

interface Avatar3DProps {
  avatarState: AvatarState;
  onAnimationComplete?: () => void;
}

const AvatarHead: React.FC<{ avatarState: AvatarState }> = ({ avatarState }) => {
  const meshRef = useRef<Mesh>(null);
  const [bobOffset, setBobOffset] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Breathing animation
      const breathingScale = 1 + Math.sin(time * 2) * 0.02;
      meshRef.current.scale.setScalar(breathingScale);

      // Bobbing animation when speaking
      if (avatarState.isSpeaking) {
        setBobOffset(Math.sin(time * 8) * 0.1);
        meshRef.current.position.y = bobOffset;
      } else {
        setBobOffset(0);
        meshRef.current.position.y = 0;
      }

      // Color changes based on emotion
      if (meshRef.current.material) {
        const material = meshRef.current.material as any;
        switch (avatarState.emotion) {
          case 'happy':
            material.color.setHex(0x4ade80); // Green
            break;
          case 'concerned':
            material.color.setHex(0xf87171); // Red
            break;
          case 'encouraging':
            material.color.setHex(0x60a5fa); // Blue
            break;
          default:
            material.color.setHex(0x94a3b8); // Gray
        }
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#94a3b8" />
    </Sphere>
  );
};

const AvatarEyes: React.FC<{ avatarState: AvatarState }> = ({ avatarState }) => {
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (leftEyeRef.current && rightEyeRef.current) {
      // Blinking animation
      const blink = Math.sin(time * 3) > 0.9 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;

      // Eye movement when listening
      if (avatarState.isListening) {
        const lookX = Math.sin(time * 2) * 0.1;
        leftEyeRef.current.position.x = -0.3 + lookX;
        rightEyeRef.current.position.x = 0.3 + lookX;
      } else {
        leftEyeRef.current.position.x = -0.3;
        rightEyeRef.current.position.x = 0.3;
      }
    }
  });

  return (
    <group>
      <Sphere ref={leftEyeRef} args={[0.1, 16, 16]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.1, 16, 16]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
    </group>
  );
};

const AvatarMouth: React.FC<{ avatarState: AvatarState }> = ({ avatarState }) => {
  const mouthRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (mouthRef.current) {
      const time = state.clock.getElapsedTime();
      
      if (avatarState.isSpeaking) {
        // Mouth movement when speaking
        const openAmount = Math.abs(Math.sin(time * 10)) * 0.3;
        mouthRef.current.scale.y = 0.1 + openAmount;
        mouthRef.current.scale.x = 0.3 + openAmount * 0.5;
      } else {
        mouthRef.current.scale.y = 0.1;
        mouthRef.current.scale.x = 0.3;
      }
    }
  });

  return (
    <Box ref={mouthRef} args={[0.3, 0.1, 0.1]} position={[0, -0.2, 0.8]}>
      <meshStandardMaterial color="#1f2937" />
    </Box>
  );
};

const AvatarBody: React.FC = () => {
  return (
    <group>
      {/* Torso */}
      <Cylinder args={[0.8, 0.6, 2, 8]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#3b82f6" />
      </Cylinder>
      
      {/* Arms */}
      <Cylinder args={[0.2, 0.15, 1.5, 8]} position={[-1.2, -1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#1e40af" />
      </Cylinder>
      <Cylinder args={[0.2, 0.15, 1.5, 8]} position={[1.2, -1.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#1e40af" />
      </Cylinder>
    </group>
  );
};

const Avatar3D: React.FC<Avatar3DProps> = ({ avatarState, onAnimationComplete }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <group position={[0, 0, 0]}>
          <AvatarHead avatarState={avatarState} />
          <AvatarEyes avatarState={avatarState} />
          <AvatarMouth avatarState={avatarState} />
          <AvatarBody />
        </group>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default Avatar3D;
