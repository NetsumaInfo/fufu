'use client';

import React from 'react';
import { cubicBezier } from 'motion';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

const easeCurve = cubicBezier(0.45, 0, 0.55, 1);

const pulseTransition = {
  duration: 18,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: easeCurve,
};

const sparkTransition = {
  duration: 22,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: easeCurve,
};

export function HeroMotionLayer() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });
  const translate = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;

  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (target: MediaQueryList | MediaQueryListEvent) => {
      setEnabled(!target.matches);
    };

    update(query);

    const handleChange = (event: MediaQueryListEvent) => update(event);
    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      x.set(0);
      y.set(0);
      return;
    }

    const handlePointer = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (event.clientX / innerWidth - 0.5) * 50;
      const normalizedY = (event.clientY / innerHeight - 0.5) * 35;
      x.set(normalizedX);
      y.set(normalizedY);
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });

    return () => window.removeEventListener('pointermove', handlePointer);
  }, [enabled, x, y]);

  const layerStyle = enabled ? { transform: translate as unknown as string } : undefined;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-solo-night via-transparent to-solo-void" />
      <motion.div
        className="from-solo-500/12 via-solo-glow/16 to-solo-ember/12 absolute -inset-32 bg-gradient-to-br blur-3xl"
        style={layerStyle}
      />
      <motion.div
        className="bg-solo-glow/14 absolute left-[16%] top-[12%] size-72 rounded-full blur-3xl"
        animate={
          enabled
            ? { opacity: [0.22, 0.45, 0.22], scale: [1, 1.08, 1] }
            : { opacity: 0.3, scale: 1 }
        }
        transition={pulseTransition}
      />
      <motion.div
        className="bg-solo-ember/18 absolute right-[12%] top-[18%] size-44 rounded-full blur-3xl"
        animate={
          enabled ? { opacity: [0.18, 0.4, 0.18], scale: [1, 1.1, 1] } : { opacity: 0.25, scale: 1 }
        }
        transition={{ ...pulseTransition, duration: 20 }}
      />
      <motion.div
        className="from-solo-500/18 via-solo-glow/8 absolute inset-x-0 bottom-[-40%] h-3/5 rounded-full bg-gradient-to-t to-transparent blur-3xl"
        animate={
          enabled ? { opacity: [0.2, 0.36, 0.2], scale: [1, 1.05, 1] } : { opacity: 0.24, scale: 1 }
        }
        transition={{ ...pulseTransition, duration: 26 }}
      />

      <div className="absolute inset-0">
        {SPARKS.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute block h-[3px] w-[120px] origin-left rounded-full bg-gradient-to-r from-transparent via-solo-glow/70 to-transparent opacity-60"
            style={{ left: spark.left, top: spark.top, rotate: spark.rotate }}
            animate={
              enabled
                ? {
                    opacity: [0.2, 0.65, 0.2],
                    scaleX: [0.8, 1.1, 0.8],
                  }
                : { opacity: 0.35, scaleX: 1 }
            }
            transition={{ ...sparkTransition, duration: spark.duration }}
          />
        ))}
      </div>
    </div>
  );
}

const SPARKS = [
  { id: 'spark-1', left: '12%', top: '34%', rotate: -4, duration: 18 },
  { id: 'spark-2', left: '28%', top: '58%', rotate: 8, duration: 22 },
  { id: 'spark-3', left: '58%', top: '42%', rotate: -12, duration: 20 },
  { id: 'spark-4', left: '72%', top: '64%', rotate: 6, duration: 24 },
  { id: 'spark-5', left: '38%', top: '22%', rotate: 14, duration: 26 },
] as const;
