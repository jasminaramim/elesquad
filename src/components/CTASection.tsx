import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px]">
      <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl p-10 md:p-24 text-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
            alt="Team working" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-40"
          />
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6C4DF6]/10 border border-[#6C4DF6]/20 rounded-full mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-[#6C4DF6] rounded-full animate-pulse shadow-[0_0_10px_#6C4DF6]"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#6C4DF6]">Available For New Projects</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[72px] font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Transform Your Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DF6] to-[#E93D82] italic pr-2">Identity with Elesquad.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            We combine high-performance engineering with world-class design to build products that don't just work—they inspire. Ready to launch?
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Link to="/contact">
              <button className="px-8 py-4 bg-[#6C4DF6] hover:bg-[#5b3ed6] text-white rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(108,77,246,0.3)] flex items-center gap-2 group">
                Let's Build Together 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/projects">
              <button className="px-8 py-4 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-full text-sm font-bold transition-all backdrop-blur-sm">
                Check Our Case Studies
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
