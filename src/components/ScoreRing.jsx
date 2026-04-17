import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score, size = 120 }) {
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-walnut-mid/20"
          strokeWidth="12"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-amber-glow drop-shadow-soft"
          strokeWidth="12"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-title text-4xl font-bold text-walnut-dark">{score}</span>
        <span className="text-xs text-walnut-mid">점</span>
      </div>
    </div>
  );
}
