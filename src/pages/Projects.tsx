import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import CTASection from '../components/CTASection';
import { Link } from 'react-router-dom';
import { Card, SectionHeading, Button } from '../components/UI';
import { ArrowRight, MessageSquare, Star, Globe, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px]">
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
            {paginatedProjects.map((project, i) => (
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

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 text-white/60 hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-primary text-white shadow-[0_0_20px_rgba(108,77,246,0.3)]' 
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-primary/50 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 text-white/60 hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Review Marquee Section */}
      <section className="py-[50px] lg:py-[100px] relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-16">
          <div className="text-center md:text-left">
            <SectionHeading title="Client Testimonials" subtitle="Success Stories" />
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
                      {[...Array(Math.floor(review.rating || 5))].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
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

      {/* Reusable CTA Section */}
      <CTASection />
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
