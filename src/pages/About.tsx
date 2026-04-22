import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading, Card } from '../components/UI';
import { Target, Rocket, Users, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Founded', val: '2022' },
  { label: 'Projects', val: '150+' },
  { label: 'WP Sites', val: '100+' },
  { label: 'Team', val: '12' },
];

const values = [
  { icon: Target, title: 'Precision', desc: 'Crafting pixel-perfect Elementor layouts and clean Gutenberg functionality.' },
  { icon: Rocket, title: 'Speed', desc: 'Optimizing backend performance and frontend rendering for blazing fast UX.' },
  { icon: Users, title: 'Support', desc: 'Expert maintenance and troubleshooting for WordPress and custom app ecosystems.' },
  { icon: ShieldCheck, title: 'Security', desc: 'Enterprise-grade protection for WooCommerce stores and digital identities.' },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-32">
      {/* Intro */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <SectionHeading title="WordPress, Woodmart & Page Builder Experts" subtitle="Who We Are" />
          <p className="text-2xl text-white/60 leading-relaxed mb-8">
            Elesquad are elite experts in WordPress Frontend & Backend, WooCommerce Functionality, 
            Woodmart Premium themes, Gutenberg, and Elementor Pro.
          </p>
          <p className="text-lg text-white/40 leading-relaxed max-w-lg mb-12">
            We bridge the gap between creative design and complex backend infrastructure. 
            Whether it's a high-converting eCommerce store or a custom frontend application, 
            we deliver results that matter.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <h4 className="text-3xl font-display font-bold text-primary mb-1">{s.val}</h4>
                <p className="text-xs font-mono uppercase tracking-widest text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Card className="p-0 overflow-hidden" tiltEnabled={true}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
              alt="Team at work" 
              className="w-full aspect-square object-cover" 
            />
          </Card>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full z-[-1]" />
        </motion.div>
      </section>

      {/* Values */}
      <section>
        <SectionHeading title="Our Core Values" subtitle="What Drives Us" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full group">
                <v.icon size={40} className="text-primary mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <h4 className="text-2xl font-bold mb-4">{v.title}</h4>
                <p className="text-white/60 leading-relaxed">{v.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white/5 p-12 md:p-20 rounded-[4rem]">
        <SectionHeading title="Powered by the Best" subtitle="Our Tech Stack" />
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           {['WordPress', 'Woodmart', 'Elementor Pro', 'WooCommerce', 'Gutenberg', 'React', 'Node.js', 'Express', 'Tailwind', 'Motion'].map(tech => (
             <span key={tech} className="text-3xl font-display font-bold hover:text-primary transition-colors cursor-default">{tech}</span>
           ))}
        </div>
      </section>
    </div>
  );
}
