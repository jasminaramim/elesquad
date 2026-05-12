import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SectionHeading, Card } from '../components/UI';
import { Target, Rocket, Users, ShieldCheck, ChevronDown, Star, MessageSquare, Quote, Layout, Phone, MapPin, Globe } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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

const faqs = [
  { q: 'Do you provide custom WordPress theme development?', a: 'Yes, we specialize in building pixel-perfect custom WordPress themes from scratch, tailored specifically to your brand identity and functional requirements.' },
  { q: 'Can you convert my Figma/Adobe XD design to Elementor?', a: 'Absolutely! We take your high-fidelity designs and transform them into fully responsive, interactive Elementor Pro layouts that match the design exactly.' },
  { q: 'How do you ensure the website speed is optimized?', a: 'We implement advanced caching, image compression (WebP), LCP optimization, and clean coding practices to ensure your site loads blazingly fast on all devices.' },
  { q: 'Do you offer ongoing maintenance and support?', a: 'Yes, we provide regular updates, security monitoring, and technical troubleshooting to keep your WordPress ecosystem running smoothly.' },
];

export default function About() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/reviews').then(res => setReviews(res.data));
  }, []);

  return (
    <div className="pb-[50px] lg:pb-[100px] pt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
      {/* Intro */}
      <section className="py-[50px] lg:py-[100px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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

      {/* Core Values */}
      <section className="py-[50px] lg:py-[100px]">
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

      {/* New Design-Accurate Process Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Image with Experience Cutout */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
                alt="Our Process" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              
              {/* Experience Cutout Bottom Left */}
              <div className="absolute bottom-0 left-0 bg-[#0A0A0A] p-8 md:p-12 rounded-tr-[3rem] border-r border-t border-white/5 z-20 shadow-[10px_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-5">
                  <span className="text-[35px] md:text-8xl font-black text-[#6C4DF6] tracking-tighter drop-shadow-[0_0_20px_rgba(108, 77, 246,0.3)]">25+</span>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest leading-tight">Years Of</span>
                    <span className="text-xs md:text-sm font-black text-white/40 uppercase tracking-widest leading-tight mt-1">Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Process Steps */}
          <div className="space-y-16 order-1 lg:order-2">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-[1px] bg-[#6C4DF6]"></div>
                 <span className="text-[#6C4DF6] font-black uppercase tracking-[0.3em] text-[10px]">Process Step</span>
              </div>
              <h2 className="text-[35px] md:text-7xl font-bold leading-[1.05] mb-8 tracking-tighter">
                Refining Concepts <br/>
                <span className="text-primary">For Better Outcomes</span>
              </h2>
              <p className="text-xl text-white/40 leading-relaxed max-w-xl font-light italic">
                "We test every element for quality, user experience, and performance to ensure it aligns perfectly with your elite business goals."
              </p>
            </div>

            <div className="relative space-y-12 pl-12">
              {/* Vertical Line Connector */}
              <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#6C4DF6] via-primary to-white/5"></div>

              {[
                { 
                  title: 'Consultation', 
                  desc: 'We start with a high-level consultation to understand your business ecosystem and target audience, ensuring a tailored digital solution.',
                  color: '#6C4DF6',
                  icon: MessageSquare
                },
                { 
                  title: 'Planning & Development', 
                  desc: 'Based on your elite needs, we architect a strategic roadmap covering design, full-stack development, and aggressive marketing.',
                  color: '#6C4DF6',
                  icon: Layout
                },
                { 
                  title: 'Implementation', 
                  desc: 'We execute the blueprint, deploy high-performance assets, and continuously monitor performance for peak optimization.',
                  color: '#ffffff',
                  icon: Rocket
                }
              ].map((step, i) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative group"
                >
                  {/* Icon Circle */}
                  <div 
                    className="absolute -left-[64px] top-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-700 bg-[#0A0A0A] z-10 group-hover:scale-110"
                    style={{ borderColor: step.color + '33' }}
                  >
                    <step.icon size={18} style={{ color: step.color }} className={i === 0 ? "drop-shadow-[0_0_8px_rgba(108, 77, 246,0.5)]" : ""} />
                    
                    {/* Pulsing Aura for the active/first step */}
                    {i === 0 && (
                      <div className="absolute inset-0 rounded-full bg-[#6C4DF6]/20 animate-ping -z-10"></div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold mb-3 transition-all duration-500 group-hover:translate-x-2" style={{ color: 'white' }}>
                      {step.title}
                    </h4>
                    <p className="text-white/40 text-sm leading-relaxed max-w-md group-hover:text-white/60 transition-colors">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-[50px] lg:py-[100px]">
        <SectionHeading title="Frequently Asked Questions" subtitle="Got Questions?" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">?</span>
                  {faq.q}
                </h4>
                <p className="text-white/40 leading-relaxed pl-11">{faq.a}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
      {/* Dynamic Review Carousel (Homepage Design) - FULL WIDTH */}
      <section className="py-[50px] lg:py-[100px] relative overflow-hidden bg-none">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-20">
          <SectionHeading title="What Our Clients Say" subtitle="Reviews" centered />
        </div>
        
        <div className="relative overflow-hidden group">
          <motion.div 
            animate={{ 
              x: reviews.length > 0 ? ["0%", `-${(reviews.length * 450) / 15}%`] : "0%"
            }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 px-4 pb-20 no-scrollbar select-none"
          >
             {[...reviews, ...reviews].map((review, i) => (
               <motion.div
                 key={`${review._id}-${i}`}
                 className="min-w-[350px] md:min-w-[450px]"
               >
                 <Card className="p-10 h-full flex flex-col gap-6 bg-white/[0.03] border-white/5 relative hover:border-primary/30 transition-all">
                    <MessageSquare size={40} className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                    
                    <div className="flex text-primary gap-1">
                      {[...Array(review.rating || 5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>
                    
                    <h4 className="text-xl font-bold">{review.title || 'Exceptional Results'}</h4>
                    <p className="text-white/60 leading-relaxed italic text-lg">"{review.feedback}"</p>
                    
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                       <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden">
                          {review.image ? <img src={review.image} className="w-full h-full object-cover" /> : (review.clientName || 'C')[0]}
                       </div>
                       <div>
                          <h5 className="font-bold">{review.clientName}</h5>
                          <p className="text-[10px] uppercase text-white/20 tracking-widest">Verified Client</p>
                       </div>
                    </div>
                 </Card>
               </motion.div>
             ))}
          </motion.div>
          
          {/* Subtle gradient fades for the carousel */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        </div>
      </section>


    </div>
  );
}


