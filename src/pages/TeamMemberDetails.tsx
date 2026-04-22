import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Globe, MessageSquare, Loader2 } from 'lucide-react';
import { Button, Card } from '../components/UI';
import axios from 'axios';

export default function TeamMemberDetails() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/team/${id}`)
      .then(res => setMember(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center shimmer">Loading Profile...</div>;
  if (!member) return <div className="h-screen flex items-center justify-center">Member Not Found</div>;

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <Link 
            to="/team" 
            className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Return to Squad</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                 <h4 className="text-primary font-mono text-xs uppercase tracking-[0.3em]">{member.designation || member.role}</h4>
                 <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#6C4DF6]"></span>
                 <p className="text-white/20 text-[10px] uppercase tracking-widest">{member.team || 'Elesquad Core'}</p>
              </div>
              <h1 className="text-5xl md:text-8xl font-display font-bold leading-tight mb-8">
                {member.name}
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pb-6"
            >
              <div className="flex gap-4">
                {[Globe, Mail, MessageSquare].map((Icon, i) => (
                  <Button key={i} variant="outline" className="w-14 h-14 rounded-full p-0 flex items-center justify-center">
                    <Icon size={20} />
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        {/* Background Accent */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 sticky top-32">
              <img 
                src={member.image || `https://i.pravatar.cc/150?u=${member._id}`} 
                alt={member.name} 
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              <div className="p-8 space-y-6">
                <div>
                  <h5 className="text-[10px] font-mono uppercase text-white/40 mb-2 tracking-widest">Base Of Operations</h5>
                  <p className="font-display font-bold">{member.team || 'Elesquad HQ'}</p>
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <div>
                  <h5 className="text-[10px] font-mono uppercase text-white/40 mb-2 tracking-widest">Connect Directly</h5>
                  <p className="font-display font-bold">{member.email || 'contact@elesquad.pro'}</p>
                </div>
                {member.phone && (
                  <>
                    <div className="w-full h-[1px] bg-white/5" />
                    <div>
                      <h5 className="text-[10px] font-mono uppercase text-white/40 mb-2 tracking-widest">Direct Phone</h5>
                      <p className="font-display font-bold font-mono">{member.phone}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-20">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[10px] font-mono uppercase text-primary mb-6 tracking-[0.3em]">Biography</h3>
              <p className="text-2xl text-white/70 leading-relaxed font-light italic">
                "{member.bio || `Innovation is at the heart of everything I do. As a lead ${member.role}, I strive to create digital experiences that are not only functional but truly transformative.`}"
              </p>
            </motion.div>

            {/* Latest Projects Section */}
            <LatestProjects userId={member._id} />
          </div>
        </div>
      </section>
    </div>
  );
}

function LatestProjects({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/projects?userId=${userId}&published=true`)
      .then(res => setProjects(res.data.slice(0, 4)))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="h-40 glass rounded-3xl animate-pulse" />;
  if (projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-mono uppercase text-primary tracking-[0.3em]">Latest Published Work</h3>
        <div className="w-20 h-[1px] bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <Card key={project._id} className="p-6 group relative overflow-hidden h-full flex flex-col gap-4">
             <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 mb-2">
                <img src={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             </div>
             <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-lg">{project.title}</h4>
                  <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">{project.projectType}</span>
                </div>
                <p className="text-xs text-white/40 line-clamp-2 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[9px] font-mono text-white/30 uppercase">{s}</span>
                  ))}
                </div>
             </div>
             {project.liveLink && (
               <a 
                 href={project.liveLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="absolute top-8 right-8 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <Globe size={16} />
               </a>
             )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
          </div>
        </div>
      </section>
    </div>
  );
}
