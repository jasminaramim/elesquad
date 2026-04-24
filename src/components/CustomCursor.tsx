import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  const spawnStar = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    const size = Math.random() * 4 + 2;
    const colors = ['#6C4DF6', '#A78BFA', '#F472B6', '#FFFFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const newStar: Star = { id, x, y, size, color };
    setStars((prev) => [...prev.slice(-20), newStar]);
    
    // Remove star after animation
    setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id !== id));
    }, 1000);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      spawnStar(e.clientX, e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        window.getComputedStyle(target).cursor === 'pointer' || 
        ['BUTTON', 'A', 'Link'].includes(target.tagName)
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleHover);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [spawnStar]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block overflow-hidden">
      {/* Falling Stars (Trail) */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 1, x: star.x, y: star.y, scale: 1 }}
            animate={{ 
              opacity: 0, 
              y: star.y + 100, // Fall effect
              x: star.x + (Math.random() - 0.5) * 40, // Slight horizontal drift
              scale: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: 'fixed',
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${star.color}`,
              left: 0,
              top: 0
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Cursor Head - Rounded Circle */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center z-[10000]"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.5 }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      >
        {/* Glow */}
        <div className="absolute w-10 h-10 bg-primary/20 blur-xl rounded-full" />
        
        {/* Rounded Circle Tip */}
        <div 
          className="w-5 h-5 bg-white rounded-full shadow-[0_0_20px_rgba(108,77,246,0.8)] border border-primary/50 relative"
        >
          {/* Inner Blinking Dot */}
          <motion.div 
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-1 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
