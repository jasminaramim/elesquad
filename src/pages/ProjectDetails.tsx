import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Globe, CheckCircle, DollarSign, User, ShieldCheck, Calendar, Briefcase } from 'lucide-react';
import { Button, Card } from '../components/UI';
import axios from 'axios';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/projects/${id}`)
      .then(res => setProject(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl shimmer text-primary">Deciphering Code...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center text-2xl">Project Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <Link to="/projects">
        <Button variant="outline" className="mb-12 group">
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} /> Return to Gallery
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <Card className="p-0 overflow-hidden border-white/10 relative" tiltEnabled={true}>
            <img src={project.image && project.image !== "" ? project.image : undefined} alt={project.title} className="w-full aspect-[4/5] md:aspect-auto object-cover" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-mono text-primary uppercase tracking-widest">
              {project.projectType || 'Standard'}
            </span>
            <span className="text-white/20 text-[10px] font-mono">/ ID: {project.orderId || 'UNTRACKED'}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-8 leading-[0.9] tracking-tighter">
            {project.title.split(' ').map((word: string, i: number) => (
              <span key={i} className={i % 2 !== 0 ? 'text-white/40' : 'text-white'}>{word} </span>
            ))}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 py-8 border-y border-white/5">
            <div>
              <p className="text-[10px] font-mono uppercase text-primary/40 mb-2 tracking-widest">Client</p>
              <p className="font-bold text-lg flex items-center gap-2"><User size={14} className="text-primary" /> {project.clientName || 'Private Client'}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-primary/40 mb-2 tracking-widest">Revenue</p>
              <p className="font-bold text-lg flex items-center gap-2"><DollarSign size={14} className="text-primary" /> {project.value || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-primary/40 mb-2 tracking-widest">Strategy</p>
              <p className="font-bold text-lg flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> {project.projectType === 'squad' ? 'Collective' : 'Solo Execution'}</p>
            </div>
          </div>

          <p className="text-xl text-white/60 mb-12 leading-relaxed font-light italic">
             "{project.description}"
          </p>

          <div className="space-y-8 mb-12">
            <div>
              <h4 className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech: string) => (
                  <span key={tech} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-mono text-white/50">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-6">
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="w-full md:w-auto">
                <Button className="w-full md:px-12 py-6 text-lg">Launch Project <ExternalLink size={20} className="ml-3" /></Button>
              </a>
            )}
            {project.sheetLink && (
              <a href={project.sheetLink} target="_blank" rel="noreferrer" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:px-10 py-6 text-lg border-primary/20 text-primary hover:bg-primary/5">
                  Business Sheet <Briefcase size={20} className="ml-3" />
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card className="p-12 md:col-span-2 border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck size={200} strokeWidth={0.5} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-6">Strategic Impact</h3>
            <p className="text-white/50 text-lg leading-relaxed">
              This project represents a significant milestone in our portfolio, focusing on delivering 
              tangible value through technical excellence. By leveraging the latest in digital strategy 
              and architectural best practices, we achieved a result that not only meets but exceeds 
              market expectations for performance and user retention.
            </p>
         </Card>
         <Card className="p-12 border-primary/20 bg-primary/5">
            <h3 className="text-xl font-display font-bold mb-6">Key Outcomes</h3>
            <ul className="space-y-4">
               {[
                 'Advanced Performance Optimization',
                 'Premium User Interface Design',
                 'Seamless Mobile Responsiveness',
                 'Enhanced Data Security Protocols'
               ].map(item => (
                 <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle size={16} className="text-primary flex-shrink-0" /> {item}
                 </li>
               ))}
            </ul>
         </Card>
      </div>
    </div>
  );
}

