import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function TechBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Mouse tracking
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 50);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 50);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] bg-bg overflow-hidden transition-colors duration-300">
      {/* 3D Grid System */}
      <motion.div 
        style={{ 
          rotateX: useTransform(mouseY, (v) => v * -0.1),
          rotateY: useTransform(mouseX, (v) => v * 0.1),
          translateZ: -100
        }}
        className="absolute inset-[-10%] opacity-20 transform-gpu"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* Floating Particle/Tech Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <TechParticle key={i} />
        ))}
      </div>

      {/* Dynamic Glowing Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full"
      />
      
      <motion.div 
        animate={{ 
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/5 blur-[180px] rounded-full"
      />

      {/* Mouse Follow Light */}
      <motion.div 
        style={{ 
          x: useTransform(mouseX, (v) => v * 20),
          y: useTransform(mouseY, (v) => v * 20),
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"
      />
    </div>
  );
}

function TechParticle() {
  const delay = Math.random() * 5;
  const duration = 10 + Math.random() * 20;
  const size = 2 + Math.random() * 4;
  const x = Math.random() * 100;
  const y = Math.random() * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: `${x}%`, y: `${y}%` }}
      animate={{ 
        opacity: [0, 0.5, 0],
        y: [`${y}%`, `${y - 10}%`, `${y}%`],
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut"
      }}
      className="absolute w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#6C4DF6]"
      style={{ width: size, height: size }}
    />
  );
}
