import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code, Layout, Smartphone, Palette, Shield, Globe, Star, Users, CheckCircle, MessageSquare, ChevronDown, Share2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, SectionHeading } from '../components/UI';
import axios from 'axios';

const brands = ['Logoisum', 'Logoisum', 'Logoisum', 'Logoisum', 'Logoisum'];

const services = [
  { icon: Layout, title: 'WordPress & Woodmart', desc: 'Expert in WordPress frontend/backend, specializing in Woodmart premium theme customization.' },
  { icon: Code, title: 'WooCommerce Pro', desc: 'Advanced eCommerce functionality and custom checkout experiences with WooCommerce.' },
  { icon: Smartphone, title: 'Gutenberg & Elementor', desc: 'Building high-performance pages with pixel-perfect precision using Elementor Pro and Gutenberg.' },
  { icon: Palette, title: 'Full Stack Solutions', desc: 'Comprehensive web solutions from core architectural development to creative UI/UX.' },
  { icon: Shield, title: 'Performance Optimization', desc: 'Ensuring your site scores top marks in speed, accessibility, and security.' },
  { icon: Globe, title: 'Scalable Architecture', desc: 'Building systems that grow with your business, from simple sites to complex enterprise platforms.' },
];

const faqs = [
  { q: "What Services Do You Offer In Web Development?", a: "We specialize in WordPress, WooCommerce, Elementor, and Gutenberg functionality, covering both frontend and backend needs." },
  { q: "How Long Does It Take To Build A Website?", a: "Timeline depends on complexity, but usually ranges from 2-6 weeks for most projects." },
  { q: "Do You Provide Ongoing Support After The Website Is Launched?", a: "Yes, we offer maintenance plans to ensure your site remains secure and up-to-date." },
  { q: "What Is The Cost Of A Web Development Project?", a: "Pricing is relative to scale and features. Contact us for a personalized quote." },
];

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get('/api/projects').then(res => setProjects(res.data.slice(0, 4)));
    axios.get('/api/reviews').then(res => setReviews(res.data.slice(0, 15)));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* ... Hero, Brands, About, Services ... */}
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
          
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-8"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/80">Expert Squad</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              style={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
              className="text-[6vw] md:text-[8vw] lg:text-[110px] font-bold leading-[0.85] tracking-tighter mb-10 font-display"
            >
              WordPress Beyond <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-sm">The Limits.</span><br/>
              <span className="italic font-light text-white/40 text-[4vw] md:text-[5vw] lg:text-[70px] block mt-4">Elite Squad Engineering</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light"
            >
              We are experts in WordPress Frontend & Backend, WooCommerce Functionality, 
              Woodmart, Gutenberg, and Elementor Pro.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 mb-12"
            >
              <Link to="/contact">
                <Button className="w-full sm:w-auto px-10 flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="w-full sm:w-auto px-10">View Projects</Button>
              </Link>
            </motion.div>

            <div className="flex gap-4">
              {[Globe, Mail, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary transition-all text-white/40 hover:text-white group">
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Tech Related Animation Replacement */}
          <div className="hidden xl:col-span-4 xl:flex justify-center items-center relative">
            <motion.div
              animate={{ 
                x: mousePos.x * 0.5, 
                y: mousePos.y * 0.5,
                rotateX: mousePos.y * -0.5,
                rotateY: mousePos.x * 0.5,
              }}
              className="relative w-full aspect-square max-w-md transform-gpu"
              style={{ perspective: 1000 }}
            >
              {/* Central Tech Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 bg-primary/40 rounded-full blur-3xl animate-pulse" />
                 <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-white/10 rounded-full"
                 />
                 <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-primary/20 rounded-full"
                 />
                 <Code size={100} className="text-primary relative z-10" />
              </div>

              {/* Floating Tech Icons */}
              {[
                { icon: Smartphone, top: '10%', left: '10%', delay: 0 },
                { icon: Globe, top: '15%', right: '15%', delay: 0.5 },
                { icon: Shield, bottom: '20%', left: '15%', delay: 1 },
                { icon: Palette, bottom: '15%', right: '10%', delay: 1.5 },
                { icon: Layout, top: '50%', left: '-5%', delay: 2 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -20, 0],
                    x: [0, 10, 0]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                    x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                    opacity: { duration: 1, delay: i * 0.2 }
                  }}
                  style={{ position: 'absolute', top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                  className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-primary/20 transition-colors"
                >
                  <item.icon size={28} className="text-white/60" />
                </motion.div>
              ))}

              {/* Background Tech Mesh */}
              <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-5 pointer-events-none">
                 {[...Array(36)].map((_, i) => (
                   <div key={i} className="w-1 h-1 bg-white rounded-full" />
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Barnd Ticker */}
      <section className="border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-wrap justify-between items-center gap-10 opacity-30 grayscale invert">
            {brands.map((brand, i) => (
              <span key={i} className="text-2xl font-bold tracking-tighter italic">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h2 className="text-[20vw] font-display font-bold whitespace-nowrap italic uppercase">About Us</h2>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <SectionHeading title="About EleSquad" subtitle="" centered />
          <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light mt-8">
            Expert in WordPress Frontend & Backend, WooCommerce Functionality, Woodmart, Gutenberg, and Elementor Pro.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            {['Our Mission', 'Our Vision', 'Our Progress'].map((item, i) => (
              <Card key={i} className="p-10 text-left border-white/5">
                <p className="text-primary text-[10px] font-mono mb-4 uppercase tracking-[0.3em]">2025</p>
                <h3 className="text-2xl font-bold mb-8">{item}</h3>
                <div className="flex justify-between items-end">
                   <div className="flex gap-4">
                     <span className="text-[10px] uppercase font-bold text-white/40">Create</span>
                     <span className="text-[10px] uppercase font-bold text-white/40">Succeed</span>
                   </div>
                   <span className="text-primary font-mono text-2xl">0{i+1}</span>
                </div>
                <div className="h-0.5 w-full bg-white/5 mt-6 relative">
                  <div className="absolute left-0 top-0 h-full bg-primary" style={{ width: '30%' }}></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end mb-20 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Our Services</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold font-display italic">WordPress Expertise</h2>
          </div>
          <Link to="/contact">
            <Button variant="outline" className="px-8 flex items-center">
              View More <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full group hover:border-primary/50 transition-all duration-500">
                <div className="flex justify-between items-start mb-12">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                     <service.icon size={28} className="text-primary group-hover:text-white" />
                   </div>
                   <span className="text-[10px] font-mono text-white/20">0{i+1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">{service.desc}</p>
                <div className="p-2 border border-white/5 rounded-full inline-flex items-center gap-4 bg-white/5">
                   <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-primary/20 border border-bg flex items-center justify-center text-[8px]">W</div>
                     <div className="w-6 h-6 rounded-full bg-purple-900/20 border border-bg flex items-center justify-center text-[8px]">E</div>
                   </div>
                   <span className="text-[8px] uppercase tracking-widest font-bold pr-4">Active Projects</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="bg-[#0a0a0a] py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <SectionHeading title="Project Overview" subtitle="Featured Projects" />
          
          <div className="space-y-12 mt-20">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="p-0 border-white/10 group overflow-hidden bg-white/5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-4 p-12 order-2 lg:order-1">
                       <p className="text-[10px] font-mono text-primary mb-4 uppercase">{new Date(project.createdAt).getFullYear()}</p>
                       <h3 className="text-6xl font-bold font-display italic mb-12 tracking-tighter group-hover:px-4 transition-all duration-500 whitespace-nowrap">{project.title}</h3>
                       <div className="flex gap-4">
                         {project.techStack?.slice(0, 2).map((t: string) => (
                           <span key={t} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold">{t}</span>
                         ))}
                       </div>
                    </div>
                    <div className="lg:col-span-5 relative order-1 lg:order-2 overflow-hidden aspect-[4/3] lg:aspect-auto h-full">
                       <img src={project.image && project.image !== "" ? project.image : undefined} alt={project.title} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                    </div>
                    <div className="lg:col-span-3 p-12 order-3">
                       <div className="flex justify-between items-center mb-6">
                         <span className="text-primary font-mono select-none">0{i+1}</span>
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1">{project.developerName || 'Elesquad Admin'}</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">{project.projectType} Project</span>
                         </div>
                       </div>
                       <p className="text-sm text-white/40 mb-10 leading-relaxed">{project.description?.slice(0, 80)}...</p>
                       <Link to={`/projects`}>
                         <button className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                            View All <ArrowRight size={16} />
                         </button>
                       </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Carousel Section */}
      <section className="py-32 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 mb-20">
          <SectionHeading title="Client Testimonials" subtitle="15+ Success Stories" centered />
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

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 md:px-10">
        <div className="text-center mb-20">
          <SectionHeading title="Asked Questions" subtitle="FAQ" centered />
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/5 rounded-2xl overflow-hidden bg-white/5">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-8 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-bold">{faq.q}</span>
                <div className={cn("transition-transform duration-300", openFaq === i ? "rotate-180" : "")}>
                  <ChevronDown className={openFaq === i ? "text-primary" : "text-white/20"} />
                </div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 pt-0 text-white/40 font-light leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end mb-20">
           <SectionHeading title="Latest Article" subtitle="Blog" />
           <Button variant="outline" className="px-10 py-3">View More <ArrowRight className="ml-2" size={16} /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {[1, 2, 3].map((post) => (
             <motion.div key={post} whileHover={{ y: -10 }} className="group">
               <Card className="p-0 border-white/5 overflow-hidden">
                 <div className="aspect-video relative overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-60"></div>
                 </div>
                 <div className="p-10">
                    <p className="text-[10px] font-mono text-primary mb-4">November 27, 2025 | By KITPRO</p>
                    <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors">Why Web Development Matters For Business</h3>
                    <div className="h-0.5 w-full bg-white/5 relative mb-4">
                       <div className="absolute left-0 top-0 h-full bg-primary/30 w-0 group-hover:w-full transition-all duration-1000"></div>
                    </div>
                 </div>
               </Card>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Final CTA Footer */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 pt-20 pb-32">
         <Card className="p-20 md:p-32 rounded-[4rem] text-center bg-gradient-to-br from-white/5 to-primary/5 border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <Globe size={300} strokeWidth={0.5} />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto">
               <h2 className="text-5xl md:text-8xl font-display font-bold italic mb-10 tracking-tight leading-[0.9]">Collaborate With <span className="text-white/40">The Best</span></h2>
               <Link to="/auth">
                 <button className="px-12 py-6 bg-white text-[#050505] rounded-full font-bold text-xl hover:bg-primary hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                   Join The Squad <ArrowRight size={24} className="inline ml-3" />
                 </button>
               </Link>
            </div>
         </Card>
      </section>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
