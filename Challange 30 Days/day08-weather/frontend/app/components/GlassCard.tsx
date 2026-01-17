'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    className?: string;
    intensity?: 'light' | 'medium' | 'strong';
}

const intensityStyles = {
    light: 'bg-white/5 border-white/5',
    medium: 'bg-white/10 border-white/10',
    strong: 'bg-white/15 border-white/15',
};

export default function GlassCard({
    children,
    className = '',
    intensity = 'medium',
    ...motionProps
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`
        backdrop-blur-xl
        ${intensityStyles[intensity]}
        border
        rounded-2xl
        shadow-2xl
        shadow-black/20
        ${className}
      `}
            {...motionProps}
        >
            {children}
        </motion.div>
    );
}
