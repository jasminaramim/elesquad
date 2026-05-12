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

export function Card({ children, className, tiltEnabled = false }: CardProps) {
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden",
        variant === 'primary' 
          ? "bg-primary text-white shadow-[0_10px_40px_rgba(108,77,246,0.3)] hover:bg-white hover:text-primary" 
          : "bg-transparent border border-white/10 text-white hover:border-primary/50 hover:bg-primary/5",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-500 shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </div>
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

export function Modal({ isOpen, onClose, title, children, icon: Icon }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, icon?: any }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
        
        <div className="relative z-10 text-center">
          {Icon && (
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
              <Icon size={40} className="text-primary" />
            </div>
          )}
          <h3 className="text-3xl font-display font-bold mb-4">{title}</h3>
          <div className="text-foreground/60 mb-10 leading-relaxed">{children}</div>
          <Button onClick={onClose} className="w-full">
            Understood
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
