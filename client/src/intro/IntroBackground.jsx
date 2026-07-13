import { useMemo } from 'react';
import './intro.css';

const PARTICLE_COUNT = 18;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Renders the animated dark background:
 *   • 3 colour-shifting gradient blobs
 *   • ~46 tiny floating particles
 * Pure CSS animations — zero Framer Motion overhead.
 */
export default function IntroBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        size: rand(1.2, 3.6),
        x: rand(0, 100),
        y: rand(0, 100),
        duration: rand(9, 20),
        delay: rand(0, 14),
        drift: (Math.random() - 0.5) * 56,
      })),
    []
  );

  return (
    <div className="intro-bg" aria-hidden="true">
      <div className="intro-blob intro-blob-1" />
      <div className="intro-blob intro-blob-2" />
      <div className="intro-blob intro-blob-3" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="intro-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            '--drift': `${p.drift}px`,
            animation: `intro-particle-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
