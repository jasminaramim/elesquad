import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Mail, Link2, AtSign, Code2, ExternalLink, Star, Loader2 } from 'lucide-react';
import { Button, Card } from '../components/UI';
import axios from 'axios';

// Dynamically compute star rating: 1 star per $200 achievement, max 5
function calcStars(projects: any[]) {
  const total = projects.reduce((acc, p) => acc + (parseFloat(p.value) || 0), 0);
  const raw = Math.min(5, Math.floor(total / 200) + (projects.length >= 1 ? 1 : 0));
  return Math.min(5, raw);
}

export default function TeamMemberDetails() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/team/${id}`),
      axios.get(`/api/projects?userId=${id}`)
    ]).then(([memberRes, projectsRes]) => {
      setMember(memberRes.data);
      setProjects(projectsRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-xs font-mono uppercase tracking-widest text-primary animate-pulse">Loading Profile...</p>
    </div>
  );
  if (!member) return <div className="h-screen flex items-center justify-center">Member Not Found</div>;

  const starCount = calcStars(projects);
  const publishedProjects = projects.filter(p => p.isPublished);
  const totalAchievement = projects.reduce((acc, p) => acc + (parseFloat(p.value) || 0), 0);

  const socialLinks = [
    { icon: Globe,   href: member.website,   label: 'Website' },
    { icon: Code2,   href: member.github,    label: 'GitHub' },
    { icon: Link2,   href: member.linkedin,  label: 'LinkedIn' },
    { icon: AtSign,  href: member.twitter,   label: 'Twitter' },
    { icon: Mail,    href: member.email ? `mailto:${member.email}` : null, label: 'Email' },
  ].filter(l => l.href);

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <Link to="/team" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-12 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Return to Squad</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-primary font-mono text-xs uppercase tracking-[0.3em]">{member.designation || member.role}</h4>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#6C4DF6]" />
                <p className="text-white/20 text-[10px] uppercase tracking-widest">{member.team || 'Elesquad Core'}</p>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 flex items-center flex-wrap gap-4"
              >
                {member.name}
                {member.isVerified && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-2xl">
                    <Star className="text-primary" size={14} fill="currentColor" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Verified</span>
                  </div>
                )}
              </motion.h1>

              {/* Dynamic Star Rating */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < starCount ? 'text-primary fill-primary' : 'text-white/10 fill-none'}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  {starCount}/5 · {projects.length} Projects · ${totalAchievement.toFixed(0)} Achievement
                </span>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pb-6"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4">Connect</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/50 transition-all"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 lg:sticky lg:top-32">
              <img
                src={member.image && member.image !== '' ? member.image : `https://i.pravatar.cc/300?u=${member._id}`}
                alt={member.name}
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="p-8 space-y-5">
                <div>
                  <h5 className="text-[10px] font-mono uppercase text-white/40 mb-2 tracking-widest">Base Of Operations</h5>
                  <p className="font-display font-bold">{member.team || 'Elesquad HQ'}</p>
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <div>
                  <h5 className="text-[10px] font-mono uppercase text-white/40 mb-2 tracking-widest">Connect Directly</h5>
                  <p className="font-display font-bold text-sm break-all">{member.email || 'contact@elesquad.pro'}</p>
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
                {/* Achievement Stats */}
                <div className="w-full h-[1px] bg-white/5" />
                <div>
                  <h5 className="text-[10px] font-mono uppercase text-white/40 mb-3 tracking-widest">Achievement Rating</h5>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < starCount ? 'text-primary fill-primary' : 'text-white/10 fill-none'} />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 font-mono">{projects.length} projects · ${totalAchievement.toFixed(0)} total</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Bio + Projects */}
          <div className="lg:col-span-2 space-y-16">
            {/* Bio */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-[10px] font-mono uppercase text-primary mb-6 tracking-[0.3em]">Biography</h3>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light italic">
                "{member.bio || `Innovation is at the heart of everything I do. As a ${member.designation || member.role}, I strive to create digital experiences that are not only functional but truly transformative.`}"
              </p>
            </motion.div>

            {/* All Projects */}
            <AllProjects projects={publishedProjects} />
          </div>
        </div>
      </section>
    </div>
  );
}

function AllProjects({ projects }: { projects: any[] }) {
  if (projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-mono uppercase text-primary tracking-[0.3em]">
          Published Work ({projects.length})
        </h3>
        <div className="w-20 h-[1px] bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`} className="block group">
            <Card className="p-5 relative overflow-hidden h-full flex flex-col gap-4 hover:border-primary/40 transition-all duration-500">
              <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
                <img
                  src={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{project.title}</h4>
                  <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ml-2">{project.projectType}</span>
                </div>
                <p className="text-xs text-white/40 line-clamp-2 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[9px] font-mono text-white/30 uppercase">{s}</span>
                  ))}
                </div>
              </div>
              {/* View arrow indicator */}
              <div className="flex items-center gap-1 text-primary/0 group-hover:text-primary transition-colors text-[10px] font-mono uppercase tracking-widest">
                <ExternalLink size={12} /> View Project
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
