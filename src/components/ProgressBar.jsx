import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ label, value, delay = 0 }) {
  // value is expected to be 1-10
  const percentage = (value / 10) * 100;

  return (
    <div className="flex flex-col gap-1 w-full mb-3">
      <div className="flex justify-between text-sm">
        <span className="text-walnut-mid font-medium">{label}</span>
        <span className="text-walnut-dark font-bold">{value}/10</span>
      </div>
      <div className="h-2 w-full bg-walnut-mid/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-glow rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
