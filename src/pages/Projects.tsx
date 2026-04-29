import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, SectionHeading, Button } from '../components/UI';
import { ArrowRight, MessageSquare, Star, Globe, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProjects, resReviews] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/reviews')
        ]);
        
        const published = resProjects.data.filter((p: any) => p.isPublished);
        setProjects(published);
        setReviews(resReviews.data.slice(0, 15));
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-bg">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] md:py-[70px] lg:py-[120px]">
        <SectionHeading 
          title="Our Creative Projects" 
          subtitle="Portfolio" 
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass rounded-3xl h-96 shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Link to={`/projects/${project._id}`}>
                  <Card className="p-0 h-full">
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={project.image && project.image !== "" ? project.image : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200"} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute bottom-4 left-4">
                         <span className="px-3 py-1 bg-primary text-white text-[9px] font-bold rounded-full uppercase tracking-widest">
                            {project.projectType || 'Standard'}
                         </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                         <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em] mt-2">By {project.developerName || 'Member'}</p>
                      </div>
                      <p className="text-white/40 mb-6 line-clamp-2 leading-relaxed text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack && project.techStack.map((tech: string) => (
                          <span key={tech} className="px-2 py-0.5 glass rounded-md text-[9px] font-mono uppercase tracking-widest text-primary/80">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {project.liveLink && (
                        <div onClick={e => e.stopPropagation()}>
                          <a href={project.liveLink} target="_blank" rel="noreferrer">
                            <Button variant="outline" className="w-full py-2 text-[10px] uppercase font-bold flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white">
                               View Live Link <Globe size={12} />
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review Carousel Section */}
      <section className="py-[50px] md:py-[70px] lg:py-[120px] relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-20">
          <SectionHeading title="Client Testimonials" subtitle="Success Stories" centered />
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
          
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* New Design-Accurate CTA Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] md:py-[70px] lg:py-[120px]">
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
