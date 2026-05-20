'use client';

import { motion } from 'framer-motion';

interface PrismIconProps {
  size?: number;
  className?: string;
}

export default function PrismIcon({ size = 120, className = '' }: PrismIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Prism body */}
      <motion.polygon
        points="60,12 108,96 12,96"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Inner facet lines */}
      <motion.line
        x1="60" y1="12" x2="60" y2="96"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.35"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      />
      <motion.line
        x1="60" y1="12" x2="36" y2="54"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      />
      <motion.line
        x1="60" y1="12" x2="84" y2="54"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      />

      {/* Light beam shimmer */}
      <motion.line
        x1="80" y1="96" x2="108" y2="96"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.line
        x1="80" y1="96" x2="116" y2="108"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
      />
      <motion.line
        x1="80" y1="96" x2="118" y2="90"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.9 }}
      />
    </motion.svg>
  );
}
