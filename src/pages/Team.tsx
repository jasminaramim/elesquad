import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare, Star } from 'lucide-react';
import { Card, SectionHeading, Button } from '../components/UI';
import axios from 'axios';
import { Facebook, Instagram, Linkedin, Telegram as TelegramIcon } from '../components/BrandIcons';

export default function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/team')
      .then(res => setTeam(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] lg:py-[100px]">
      {/* Page Header - Pipeline Style */}
      <div className="text-center mb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 glass rounded-full text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-6"
        >
          Our Experts
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold mb-8"
        >
          Meet the <span className="text-primary">Squad</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          We’ve gathered a team of multidisciplinary experts dedicated to bridging 
          the gap between imagination and digital reality.
        </motion.p>
      </div>

      {/* Leadership Section */}
      <div className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] flex-grow bg-white/10" />
          <h2 className="text-2xl font-display font-bold text-primary tracking-widest uppercase">The Leadership</h2>
          <div className="h-[1px] flex-grow bg-white/10" />
        </div>
        
        <div className="max-w-6xl mx-auto">
          {team.filter(m => m.role === 'Leader').map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative flex flex-col md:flex-row items-center gap-12 glass p-8 md:p-16 rounded-[3rem] border border-primary/20 overflow-hidden"
            >
              {/* Image Left */}
              <div className="w-full md:w-1/2 relative group rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[3/4]">
                <img 
                  src={member.image && member.image !== "" ? member.image : `https://i.pravatar.cc/500?u=${member._id}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={member.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Info Right */}
              <div className="w-full md:w-1/2 text-left">
                <div className="px-4 py-1.5 bg-primary/20 border border-primary text-primary text-[10px] font-bold rounded-full inline-block mb-6 uppercase tracking-widest">
                  SQUAD LEADER
                </div>
                <h3 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white">{member.name}</h3>
                <p className="text-primary font-mono text-sm md:text-base uppercase tracking-[0.3em] mb-8">{member.designation || 'Head of Squad'}</p>
                <p className="text-white/60 text-lg leading-relaxed mb-8">
                  {member.bio || 'Leading the squad to digital excellence. Specializing in high-performance WordPress and Elementor development, turning complex requirements into seamless digital experiences.'}
                </p>
                
                <Link to={`/team/${member._id}`}>
                   <Button className="px-8 py-4 w-full md:w-auto text-center justify-center">View Full Profile</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Squad Members Section */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-[1px] flex-grow bg-white/10" />
        <h2 className="text-xl font-display font-bold text-white/40 tracking-widest uppercase">Squad Members</h2>
        <div className="h-[1px] flex-grow bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="glass rounded-3xl h-[400px] shimmer" />)
        ) : (
          team.filter(m => m.role !== 'Leader').map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col h-full"
            >
              <div className="relative flex-grow flex flex-col overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors duration-500 h-full">
                {/* Image Link */}
                <Link to={`/team/${member._id}`} className="block aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={member.image && member.image !== "" ? member.image : `https://i.pravatar.cc/150?u=${member._id}`} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  />
                </Link>

                {/* Info Box Link */}
                <Link to={`/team/${member._id}`} className="p-8 text-center flex-grow flex flex-col justify-center hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-[1px] bg-primary/30 mx-auto mb-4 group-hover:w-20 transition-all" />
                  <h3 className="text-xl font-display font-bold mb-1 group-hover:text-primary transition-colors tracking-tight flex items-center justify-center gap-2 text-white">
                    {member.name}
                    {member.isVerified && (
                      <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-lg" title="Verified Member">
                        <Star size={8} fill="currentColor" />
                      </div>
                    )}
                  </h3>
                  <div className="flex flex-col items-center justify-center gap-1">
                     <p className="text-primary font-mono text-[9px] uppercase tracking-[0.2em]">{member.designation || 'Squad Member'}</p>
                     <p className="text-white/20 text-[8px] uppercase tracking-widest">{member.team || 'Member'}</p>
                  </div>
                </Link>

                {/* Social Hover Overlay - Completely separate from profile Links */}
                <div className="absolute inset-x-0 top-0 aspect-[4/5] pointer-events-none flex flex-col justify-end overflow-hidden z-20">
                  <div className="p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-bg/90 to-transparent pointer-events-auto">
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-primary text-white/70 hover:text-white transition-all transform hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                      {member.facebook && (
                        <a 
                          href={member.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-primary text-white/70 hover:text-white transition-all transform hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Facebook size={14} />
                        </a>
                      )}
                      {member.instagram && (
                        <a 
                          href={member.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-primary text-white/70 hover:text-white transition-all transform hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram size={14} />
                        </a>
                      )}
                      {member.telegram && (
                        <a 
                          href={`https://t.me/${member.telegram.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-primary text-white/70 hover:text-white transition-all transform hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <TelegramIcon size={14} />
                        </a>
                      )}
                      {!member.linkedin && !member.facebook && !member.instagram && !member.telegram && (
                        <div className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/20">
                          <Globe size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* CTA Section - Pipeline Kit often has a Footer CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-40 py-[50px] lg:py-[100px] px-12 md:px-20 glass rounded-[3rem] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Want to work with us?</h2>
        <p className="text-white/60 mb-10 max-w-xl mx-auto">
          We’re always looking for talented individuals who share our passion 
          for building the future of the digital world.
        </p>
        <div className="flex justify-center">
          <Link to="/contact">
            <Button className="px-10">Get In Touch</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
