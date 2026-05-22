import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code, Layout, Smartphone, Palette, Shield, Globe, Star, Users, CheckCircle, MessageSquare, ChevronDown, ChevronLeft, ChevronRight, Share2, Mail, Server, ShoppingBag, Phone, MapPin, Rocket } from 'lucide-react';
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
  const [team, setTeam] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get('/api/projects').then(res => {
      const published = res.data.filter((p: any) => p.isPublished);
      const sorted = published.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(sorted.slice(0, 4));
    });
    axios.get('/api/reviews').then(res => setReviews(res.data.slice(0, 15)));
    axios.get('/api/team').then(res => setTeam(res.data));

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
    <div className="pb-[50px] lg:pb-[100px]">
      {/* ... Hero, Brands, About, Services ... */}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-0 overflow-hidden">
        {/* Background Floating Tech Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          {[
            { icon: Globe, label: 'WordPress', top: '10%', left: '10%', delay: 0 },
            { icon: Palette, label: 'Elementor', top: '15%', right: '15%', delay: 0.5 },
            { icon: Server, label: 'PHP', top: '60%', right: '10%', delay: 0.8 },
            { icon: Code, label: 'Code', bottom: '15%', left: '12%', delay: 1.2 },
            { icon: ShoppingBag, label: 'WooCommerce', bottom: '10%', right: '20%', delay: 1.5 },
            { icon: Layout, label: 'Design', top: '40%', left: '5%', delay: 2 },
            { icon: Shield, label: 'Security', bottom: '40%', right: '5%', delay: 2.5 },
          ].map((item: any, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                y: [0, -40, 0],
                x: [0, 20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                x: { duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1, delay: i * 0.2 }
              }}
              style={{ position: 'absolute', top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
            >
              <div className="w-24 h-24 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full flex items-center justify-center shadow-2xl">
                <item.icon size={36} className="text-primary/40" />
              </div>
            </motion.div>
          ))}

          {/* Subtle Grid Pattern Behind All */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-5xl mx-auto px-5 md:px-10 flex flex-col items-center text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-10 shadow-[0_0_20px_rgba(108,77,246,0.1)]"
          >
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_#6C4DF6]"></span>
            <span className="text-xs uppercase tracking-[0.3em] font-black text-primary">Elite Engineering Squad</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[35px] lg:text-[110px] font-bold leading-[0.85] tracking-tighter mb-12 font-display"
          >
            WordPress Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-2xl">The Limits.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-xl md:text-2xl text-foreground/50 max-w-3xl mb-16 leading-relaxed font-light"
          >
            Experts in WordPress Frontend & Backend, WooCommerce Functionality,
            Woodmart, Gutenberg, and Elementor Pro. We build the impossible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-8 mb-0"
          >
            <Link to="/contact">
              <Button className="w-full sm:w-auto px-12 py-5 text-xl">
                Get Started
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" className="w-full sm:w-auto px-12 py-5 text-xl">View Our Work</Button>
            </Link>
          </motion.div>


        </div>
      </section>

      {/* Design-Accurate About Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-[50px] pb-20 relative overflow-hidden z-10">
        {/* Glow & Wireframe Sphere Background decoration */}
        <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#6C4DF6]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-[0.08] z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#6C4DF6] animate-[spin_60s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="0.25">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="40" />
            <ellipse cx="50" cy="50" rx="45" ry="15" />
            <ellipse cx="50" cy="50" rx="15" ry="45" />
            <ellipse cx="50" cy="50" rx="45" ry="28" />
            <ellipse cx="50" cy="50" rx="28" ry="45" />
            <line x1="5" y1="50" x2="95" y2="50" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <circle cx="50" cy="5" r="1.2" fill="currentColor" />
            <circle cx="50" cy="95" r="1.2" fill="currentColor" />
            <circle cx="5" cy="50" r="1.2" fill="currentColor" />
            <circle cx="95" cy="50" r="1.2" fill="currentColor" />
            <circle cx="14" cy="22" r="0.9" fill="currentColor" />
            <circle cx="86" cy="22" r="0.9" fill="currentColor" />
            <circle cx="14" cy="78" r="0.9" fill="currentColor" />
            <circle cx="86" cy="78" r="0.9" fill="currentColor" />
            <circle cx="28" cy="14" r="0.9" fill="currentColor" />
            <circle cx="72" cy="14" r="0.9" fill="currentColor" />
            <circle cx="28" cy="86" r="0.9" fill="currentColor" />
            <circle cx="72" cy="86" r="0.9" fill="currentColor" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          {/* Left Column: Image with premium rounded corners */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[520px] mx-auto lg:mx-0"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
                alt="Creative Solutions"
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-103"
              />
            </div>
          </motion.div>

          {/* Right Column: Narrative and Features */}
          <div className=" flex flex-col justify-center h-full">
            <div>
              <span className="text-[#6C4DF6] font-bold uppercase tracking-[0.3em] text-xs mb-3.5 block font-mono">About Us</span>
              <h2 className="text-white text-[32px] md:text-[46px] font-bold leading-[1.15] mb-5 tracking-tight font-display">
                Creative Solutions For Every Digital Challenge
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl font-light">
                With innovative strategies and a results-driven approach, we help you overcome obstacles and achieve long-term success.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  num: '01',
                  title: 'Tailored Solutions',
                  desc: 'Our team customizes strategies to meet the unique needs of your business, ensuring that every solution'
                },
                {
                  num: '02',
                  title: 'Innovative Strategies',
                  desc: 'Adopting the latest digital trends and technologies, ensuring that your brand is always at the forefront of innovation.'
                },
                {
                  num: '03',
                  title: 'Collaborative Partnership',
                  desc: 'By working closely with you, we build strong relationships based on trust, transparency, and open communication.'
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex gap-6 group items-start"
                >
                  <span className="text-5xl md:text-6xl font-extrabold text-[#6C4DF6]/15 group-hover:text-[#6C4DF6]/30 transition-colors duration-500 font-display shrink-0 -mt-1 select-none">
                    {feature.num}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-[#6C4DF6] mb-1.5 transition-colors group-hover:text-[#8b5cf6] duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-md">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/about" className="inline-block w-max pt-2">
              <button className="bg-[#6C4DF6] text-white hover:bg-[#5b3ed6] px-8 py-3.5 rounded-full flex items-center gap-3 font-bold transition-all shadow-[0_4px_20px_rgba(108,77,246,0.25)] hover:shadow-[0_4px_25px_rgba(108,77,246,0.45)] transform hover:-translate-y-0.5 text-xs uppercase tracking-wider font-mono">
                Read More <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* Projects Showcase Redesign */}
      <section className="relative py-[50px] lg:py-[100px] overflow-hidden bg-bg">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-8 text-center md:text-left">
            <div className="max-w-2xl flex flex-col items-center md:items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full mb-6"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-foreground/80">Selected Works</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[35px] md:text-8xl font-bold font-display leading-[0.9] tracking-tighter"
              >
                Featured <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 italic">Masterpieces.</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/projects">
                <Button variant="outline" className="px-10 group">
                  Explore All Projects
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.slice(0, 4).map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className="p-0 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] group/card overflow-hidden h-full flex flex-col"
                >
                  {/* Project Visual */}
                  <div className="aspect-[16/10] relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent z-10 opacity-60" />

                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8 }}
                    >
                      <img
                        src={project.image && project.image !== "" ? project.image : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200"}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-1000"
                      />
                    </motion.div>

                    {/* Floating Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                        <span className="text-[9px] uppercase tracking-widest font-black text-primary">{project.projectType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-10 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-primary font-mono text-sm">0{i + 1}</span>
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-[9px] uppercase tracking-widest font-bold text-white/40">
                          Case Study
                        </span>
                      </div>

                      <h3 className="text-3xl font-bold font-display leading-tight mb-4 group-hover/card:text-primary transition-colors duration-500">
                        {project.title}
                      </h3>

                      <p className="text-base text-white/40 leading-relaxed mb-8 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-10">
                        {project.techStack?.slice(0, 3).map((t: string) => (
                          <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[8px] uppercase font-black text-white/40 group-hover/card:border-primary/30 transition-colors">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/projects/${project._id}`}
                      className="inline-flex items-center gap-4 group/btn mt-auto"
                    >
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary transition-all duration-500">
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest group-hover/btn:text-primary transition-colors">Exploration</span>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom Link for Mobile */}
          <div className="mt-16 text-center md:hidden">
            <Link to="/projects">
              <Button className="w-full">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Review Marquee Section */}
      <section className="py-[50px] lg:py-[100px] relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-16">
          <div className="text-center md:text-left">
            <SectionHeading title="Client Testimonials" subtitle="15+ Success Stories" />
          </div>
        </div>

        {/* Full-width marquee track */}
        <div className="w-full overflow-hidden relative py-4 select-none">
          {/* Ambient Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#020205] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#020205] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 animate-marquee">
            {reviews.length > 0 ? (
              (reviews.length < 5 ? [...reviews, ...reviews, ...reviews, ...reviews] : [...reviews, ...reviews]).map((review, idx) => (
                <div
                  key={`${review._id}-${idx}`}
                  className="w-[320px] md:w-[450px] shrink-0"
                >
                  <Card className="p-10 h-full flex flex-col gap-6 bg-white/[0.03] border-white/5 relative hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-300">
                    <MessageSquare size={40} className="absolute top-6 right-8 text-primary/10" />

                    <div className="flex text-primary gap-1">
                      {[...Array(review.rating || 5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>

                    <h4 className="text-xl font-bold">{review.title || 'Exceptional Results'}</h4>
                    <p className="text-white/60 leading-relaxed italic text-lg line-clamp-4">"{review.feedback}"</p>

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
                </div>
              ))
            ) : (
              <div className="w-full text-center py-20 text-white/20 italic">
                Sharing success stories soon...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px]">
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
      </section>      {/* New Design-Accurate CTA Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px]">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-10">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[35px] md:text-[100px] font-black tracking-tighter leading-[0.85] max-w-5xl uppercase"
          >
            Bringing Your Vision <br />
            <span className="text-white/10">To The Digital World</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <Link to="/contact">
              <Button className="px-12 py-6 text-xl">
                Let's Talk Now
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 rounded-[3rem] overflow-hidden relative group shadow-2xl"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                  alt="Digital Squad"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>

              {/* Tags Overlay */}
              <div className="absolute bottom-12 left-12 flex flex-wrap gap-4 z-20">
                {[
                  { label: 'Design', active: true },
                  { label: 'Development', active: false },
                  { label: 'Digital Marketing', active: false },
                  { label: 'Branding & Identity', active: false },
                  { label: 'SEO', active: false },
                  { label: 'E-commerce Solutions', active: false }
                ].map((tag) => (
                  <div key={tag.label} className={cn(
                    "px-6 py-2.5 rounded-full border text-[11px] uppercase font-bold tracking-widest transition-all backdrop-blur-md flex items-center gap-2",
                    tag.active
                      ? "bg-[#6C4DF6]/20 border-[#6C4DF6] text-[#6C4DF6]"
                      : "bg-black/40 border-white/10 text-white/60 hover:border-white/30"
                  )}>
                    <Globe size={14} className={tag.active ? "text-[#6C4DF6]" : "text-white/40"} />
                    {tag.label}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 lg:-ml-12 lg:mt-24 z-30"
            >
              <div className="bg-[#0A0A0A] p-10 md:p-14 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <p className="text-lg md:text-xl leading-relaxed text-white/50 font-light italic">
                  "We bring your vision to life through innovative design, cutting-edge technology, and strategic digital marketing, ensuring your brand stands out in the digital world."
                </p>
                <div className="mt-10 h-1 w-20 bg-[#6C4DF6] rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
