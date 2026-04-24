import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function TechBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Mouse tracking
  const springConfig = { damping: 30, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 100);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 100);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, (v) => v * -0.1);
  const rotateY = useTransform(mouseX, (v) => v * 0.1);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] bg-[#050505] overflow-hidden">
      {/* 3D Moving Tech Lines / Grid */}
      <motion.div 
        style={{ 
          rotateX,
          rotateY,
          perspective: 1200,
          y: gridY
        }}
        className="absolute inset-[-50%] opacity-20 transform-gpu"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6C4DF6_1px,transparent_1px),linear-gradient(to_bottom,#6C4DF6_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Additional accent lines */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ 
              top: `${i * 10}%`, 
              left: '-20%', 
              right: '-20%',
              opacity: 0.3
            }}
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              scaleX: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        ))}
      </motion.div>

      {/* Floating Circuit Paths */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%', y: `${10 + i * 12}%` }}
            animate={{ x: '200%' }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2
            }}
            className="absolute h-[2px] w-[500px] bg-gradient-to-r from-transparent via-primary/40 to-transparent flex items-center"
          >
            <div className="w-2 h-2 bg-primary rounded-full blur-[2px] shadow-[0_0_10px_#6C4DF6]" />
          </motion.div>
        ))}
      </div>

      {/* Glowing Dynamic Orbs */}
      <motion.div 
        style={{ 
          x: useTransform(mouseX, (v) => v * 0.5),
          y: useTransform(mouseY, (v) => v * 0.5)
        }}
        className="absolute top-[10%] left-[10%] w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"
      />
      
      <motion.div 
        style={{ 
          x: useTransform(mouseX, (v) => v * -0.3),
          y: useTransform(mouseY, (v) => v * -0.3)
        }}
        className="absolute bottom-[0%] right-[0%] w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Digital Rain Particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <TechParticle key={i} />
        ))}
      </div>
    </div>
  );
}

function TechParticle() {
  const delay = Math.random() * 10;
  const duration = 15 + Math.random() * 15;
  const size = 1 + Math.random() * 2;
  const left = Math.random() * 100;

  return (
    <motion.div
      initial={{ y: '-10%', x: `${left}%`, opacity: 0 }}
      animate={{ 
        y: ['0%', '110%'],
        opacity: [0, 0.4, 0]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay,
        ease: "linear"
      }}
      className="absolute w-px h-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
    />
  );
}
