import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code, Layout, Smartphone, Palette, Shield, Globe, Star, Users, CheckCircle, MessageSquare, ChevronDown, ChevronRight, Share2, Mail, Server, ShoppingBag, Phone, MapPin, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, SectionHeading } from '../components/UI';
import axios from 'axios';
import { Facebook, Instagram, Linkedin, Telegram } from '../components/BrandIcons';

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
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
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
    <div className="pb-[50px] lg:pb-[100px]">
      {/* ... Hero, Brands, About, Services ... */}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-[50px] lg:pb-[100px] overflow-hidden">
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
            className="flex flex-col sm:flex-row gap-8 mb-20"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-6"
          >
            {[Telegram, Facebook, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary transition-all text-white/30 hover:text-white group backdrop-blur-xl">
                <Icon size={24} className="group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* New Design-Accurate About Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-[50px]  overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Image with Play Button and Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                alt="Creative Solutions"
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Play Button Top Left */}
              <div className="absolute top-8 left-8 z-20">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center group/play">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-[#6C4DF6] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(108, 77, 246,0.4)] transition-transform group-hover/play:scale-110">
                    <div className="w-0 h-0 border-t-[6px] md:border-t-[8px] border-t-transparent border-l-[10px] md:border-l-[12px] border-l-black border-b-[6px] md:border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>

              {/* Contact Info Cutout Bottom Right */}
              <div className="absolute bottom-0 right-0 bg-[#0A0A0A] p-6 md:p-10 rounded-tl-[3rem] border-l border-t border-white/5 z-20 hidden sm:block">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/60">
                    <Phone size={14} className="text-[#6C4DF6]" />
                    <span className="text-xs md:text-sm font-medium">0761-8523-398</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <Globe size={14} className="text-[#6C4DF6]" />
                    <span className="text-xs md:text-sm font-medium">www.hellodomainsite.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <MapPin size={14} className="text-[#6C4DF6]" />
                    <span className="text-xs md:text-sm font-medium">KLLG St, No.99, Pku City, ID 28289</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content and Feature List */}
          <div className="space-y-10">
            <div>
              <span className="text-[#6C4DF6] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">About Us</span>
              <h2 className="text-[35px] md:text-7xl font-bold leading-[1.1] mb-8">
                Creative Solutions For Every Digital Challenge
              </h2>
              <p className="text-lg text-white/40 leading-relaxed max-w-xl">
                With innovative strategies and a results-driven approach, we help you overcome obstacles and achieve long-term success.
              </p>
            </div>

            <div className="space-y-8">
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
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group items-start"
                >
                  <span className="text-5xl md:text-6xl font-black text-white/5 group-hover:text-[#6C4DF6]/10 transition-colors duration-500 font-display shrink-0 -mt-2">
                    {feature.num}
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-[#6C4DF6] mb-2">{feature.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed max-w-md">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/about">
              <Button>
                Read More
              </Button>
            </Link>
          </div>
        </div>
      </section>






      {/* Services Section Redesign */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Header Block */}
          <div className="lg:col-span-1 py-10 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Our Services</span>
            </div>
            <h2 className="text-[35px] md:text-6xl font-bold font-display leading-tight">
              Building Brands, <br />
              Boosting Visibility, <br />
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
                  <span className="text-6xl md:text-8xl font-black text-[#6C4DF6] tracking-tighter drop-shadow-[0_0_20px_rgba(108, 77, 246,0.3)]">25+</span>
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
                Refining Concepts <br />
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

      {/* Review Slider Section */}
      <section className="py-[50px] lg:py-[100px] relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <SectionHeading title="Client Testimonials" subtitle="15+ Success Stories" />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const container = document.getElementById('review-slider');
                if (container) container.scrollBy({ left: -450, behavior: 'smooth' });
              }}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('review-slider');
                if (container) container.scrollBy({ left: 450, behavior: 'smooth' });
              }}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          id="review-slider"
          className="flex gap-8 px-5 md:px-[100px] overflow-x-auto snap-x snap-mandatory no-scrollbar pb-20 select-none scroll-smooth"
        >
          {reviews.length > 0 ? reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="min-w-[320px] md:min-w-[450px] snap-center"
            >
              <Card className="p-10 h-full flex flex-col gap-6 bg-white/[0.03] border-white/5 relative hover:border-primary/30 transition-all">
                <MessageSquare size={40} className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

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
            </motion.div>
          )) : (
            <div className="w-full text-center py-20 text-white/20 italic">
              Sharing success stories soon...
            </div>
          )}
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
