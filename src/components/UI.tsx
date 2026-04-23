import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Tilt from 'react-parallax-tilt';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  tiltEnabled?: boolean;
  key?: React.Key;
}

export function Card({ children, className, tiltEnabled = true }: CardProps) {
  const content = (
    <div className={cn(
      "bg-card border border-border rounded-3xl p-6 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(108,77,246,0.15)] transition-all duration-500 overflow-hidden relative group",
      className
    )}>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 text-foreground">{children}</div>
    </div>
  );

  if (tiltEnabled) {
    return (
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        scale={1.02}
        transitionSpeed={1500}
        gyroscope={true}
      >
        {content}
      </Tilt>
    );
  }

  return content;
}

export function Button({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-8 py-4 rounded-xl font-bold text-lg transition-all relative overflow-hidden group",
        variant === 'primary' 
          ? "bg-primary text-white shadow-[0_0_30px_rgba(108,77,246,0.5)] border border-white/20" 
          : "bg-surface backdrop-blur-sm border border-border text-foreground hover:bg-surface/80",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
    </motion.button>
  );
}

export function SectionHeading({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={cn("mb-16", centered ? "text-center" : "")}>
      {subtitle && (
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-primary font-mono text-sm uppercase tracking-widest block mb-4"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-display font-bold leading-tight"
      >
        {title}
      </motion.h2>
    </div>
  );
}
