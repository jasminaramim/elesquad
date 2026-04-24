import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code, Layout, Smartphone, Palette, Shield, Globe, Star, Users, CheckCircle, MessageSquare, ChevronDown, ChevronRight, Share2, Mail, Server, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, SectionHeading } from '../components/UI';
import axios from 'axios';

const brands = ['Logoisum', 'Logoisum', 'Logoisum', 'Logoisum', 'Logoisum'];

// Static services replaced by dynamic fetching in component


const faqs = [
  { q: "What Services Do You Offer In Web Development?", a: "We specialize in WordPress, WooCommerce, Elementor, and Gutenberg functionality, covering both frontend and backend needs." },
  { q: "How Long Does It Take To Build A Website?", a: "Timeline depends on complexity, but usually ranges from 2-6 weeks for most projects." },
  { q: "Do You Provide Ongoing Support After The Website Is Launched?", a: "Yes, we offer maintenance plans to ensure your site remains secure and up-to-date." },
  { q: "What Is The Cost Of A Web Development Project?", a: "Pricing is relative to scale and features. Contact us for a personalized quote." },
];

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get('/api/projects').then(res => setProjects(res.data.slice(0, 4)));
    axios.get('/api/reviews').then(res => setReviews(res.data.slice(0, 15)));
    axios.get('/api/services').then(res => {
      setDbServices(res.data);
      setLoadingServices(false);
    }).catch(() => setLoadingServices(false));

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
          
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full w-fit mb-8"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-foreground/80">Expert Squad</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              style={{ x: mousePos.x * 0.1, y: mousePos.y * 0.1 }}
              className="text-[5vw] lg:text-[90px] font-bold leading-[0.85] tracking-tighter mb-10 font-display"
            >
              WordPress Beyond <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-sm">The Limits.</span><br/>
              <span className="italic font-light text-white/40 text-[3vw] lg:text-[60px] block mt-4">Elite Squad Engineering</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-12 leading-relaxed font-light"
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
                  Get Started
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="w-full sm:w-auto px-10">View Projects</Button>
              </Link>
            </motion.div>

            <div className="flex gap-4">
              {[Globe, Mail, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary transition-all text-foreground/40 hover:text-foreground group">
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Tech Related Animation Replacement */}
          <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative">
            <div
              className="relative w-full aspect-square max-w-xl transform-gpu"
              style={{ perspective: 1500 }}
            >
              {/* Central Tech Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-48 h-48 bg-primary/40 rounded-full blur-[100px] animate-pulse" />
                 <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-white/10 rounded-full"
                 />
                 <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 border border-primary/20 rounded-full"
                 />
                 <div className="relative z-10 flex flex-col items-center">
                   <Code size={120} className="text-primary mb-4" />
                   <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">System Core</span>
                 </div>
              </div>

              {/* Floating Tech Icons */}
              {[
                { img: "https://upload.wikimedia.org/wikipedia/commons/9/93/Wordpress_Blue_logo.png", label: 'WordPress', top: '5%', left: '10%', delay: 0 },
                { img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Elementor_icon.svg", label: 'Elementor', top: '10%', right: '5%', delay: 0.5 },
                { img: "https://upload.wikimedia.org/wikipedia/commons/1/16/Gutenberg_logo.svg", label: 'Gutenberg', bottom: '15%', left: '5%', delay: 1 },
                { img: "https://upload.wikimedia.org/wikipedia/commons/2/2a/WooCommerce_logo.svg", label: 'WooCommerce', bottom: '10%', right: '10%', delay: 1.5 },
                { icon: Code, label: 'Code', top: '45%', left: '-15%', delay: 2 },
                { icon: Server, label: 'Hosting', top: '40%', right: '-10%', delay: 2.5 },
                { icon: ShoppingBag, label: 'Woodmart', bottom: '-5%', left: '40%', delay: 3 },
              ].map((item: any, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -30, 0],
                    x: [0, 15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                    x: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                    rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 1, delay: i * 0.2 }
                  }}
                  style={{ position: 'absolute', top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                  className="group relative"
                >
                  <div className="w-20 h-20 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center justify-center shadow-2xl hover:bg-primary/20 hover:border-primary/50 transition-all duration-500 overflow-hidden">
                    {item.img ? (
                      <img src={item.img} alt={item.label} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform bg-white/10 p-1 rounded-xl shadow-lg" />
                    ) : (
                      <item.icon size={32} className="text-white group-hover:scale-110 transition-transform" />
                    )}
                    <span className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest text-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.label}</span>
                  </div>
                </motion.div>
              ))}

              {/* Background Tech Mesh */}
              <div className="absolute inset-0 grid grid-cols-8 gap-4 opacity-5 pointer-events-none">
                 {[...Array(64)].map((_, i) => (
                   <div key={i} className="w-1 h-1 bg-white rounded-full" />
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Redesign */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Image with Play Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop" 
                alt="About EleSquad" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent"></div>
              
              {/* Play Button Overlay */}
              <button className="absolute inset-0 flex items-center justify-center group/play">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover/play:scale-110 group-hover/play:bg-primary/20 transition-all duration-500">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <ArrowRight className="text-bg ml-1" size={32} />
                  </div>
                </div>
              </button>
            </div>

            {/* More About Us Button */}
            <div className="mt-8">
              <Link to="/about">
                <Button className="w-full sm:w-auto">
                  More About Us
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Content and Stats */}
          <div className="space-y-12">
            <div>
              <span className="text-primary font-display text-lg mb-4 block">( About Us )</span>
              <h2 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-8">
                Your vision, our expertise. <br/>
                <span className="text-white/40">Together, we build brands that stand out.</span>
              </h2>
              <p className="text-lg text-foreground/50 leading-relaxed max-w-xl">
                We are a premium digital agency specializing in high-performance web engineering. 
                Our elite squad combines technical mastery with creative innovation to push 
                the boundaries of what's possible on the web.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              {[
                { label: 'Total Clients', value: '12k' },
                { label: 'Years of Experience', value: '25+' },
                { label: 'Projects Completed', value: '130k' },
                { label: 'Expert Teams', value: '300+' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-5xl md:text-6xl font-display font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-foreground/40">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Redesign */}
      <section className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Header Block */}
          <div className="lg:col-span-1 py-10 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Our Services</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold font-display leading-tight">
              Building Brands, <br/>
              Boosting Visibility, <br/>
              and Driving Growth.
            </h2>
            <p className="text-foreground/40 text-sm leading-relaxed max-w-xs">
              We provide comprehensive digital solutions that transform businesses. 
              Our expert squad ensures your brand stands out in the digital landscape.
            </p>
          </div>

          {/* Services Grid Items */}
          {loadingServices ? (
            <div className="lg:col-span-2 flex items-center justify-center py-20 text-white/20 uppercase tracking-widest font-mono">Synchronizing Elite Services...</div>
          ) : (
            dbServices.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-6 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors block">{service.title}</span>
                    <Link to={`/services/${service._id}`} className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  <p className="text-xs text-foreground/40 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">{service.description}</p>
                  <Link to={`/services/${service._id}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Show more details <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>
              </motion.div>
            ))
          )}
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
                <Card className="p-0 border-border group overflow-hidden bg-surface">
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
                 <Button className="px-12 py-6 text-xl">
                   Join The Squad
                 </Button>
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
