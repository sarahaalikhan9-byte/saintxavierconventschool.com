import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  animationDuration: number;
  delay: number;
  opacity: number;
}

export default function ParticleBackground({ isGlass }: { isGlass: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
        newParticles.push({
            id: i,
            left: Math.random() * 100, // random percentage X position
            size: Math.random() * 6 + 2, // 2px to 8px
            animationDuration: Math.random() * 10 + 10, // 10s to 20s
            delay: Math.random() * 10,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: isGlass 
              ? 'linear-gradient(to top, rgba(56, 178, 172, 0.6), rgba(56, 178, 172, 0))' 
              : 'linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0))',
            boxShadow: isGlass ? '0 0 10px rgba(56, 178, 172, 0.3)' : '0 0 10px rgba(255, 255, 255, 0.2)',
            opacity: p.opacity,
            animation: `floatUp ${p.animationDuration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: var(--tw-bg-opacity, 1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
