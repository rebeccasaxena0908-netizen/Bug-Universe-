import { useEffect, useState } from "react";
import { Bug } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  isBug: boolean;
}

const COLORS = [
  "text-neon-pink",
  "text-neon-cyan",
  "text-neon-purple",
];

export function ParticleField({ count = 30 }: { count?: number }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      isBug: Math.random() > 0.7,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color} opacity-30`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.isBug ? (
            <Bug size={p.size * 2.5} />
          ) : (
            <div
              className="rounded-full bg-current"
              style={{ width: p.size, height: p.size }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
