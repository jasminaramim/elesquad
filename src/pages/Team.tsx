import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare, Star } from 'lucide-react';
import { Card, SectionHeading, Button } from '../components/UI';
import axios from 'axios';

export default function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/team')
      .then(res => setTeam(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="glass rounded-3xl h-[400px] shimmer" />)
        ) : (
          team.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <Link to={`/team/${member._id}`} className="block">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                  {/* Image Container */}
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img 
                      src={member.image || `https://i.pravatar.cc/150?u=${member._id}`} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Social Hover Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-bg/90 to-transparent">
                      <div className="flex justify-center gap-3">
                        {[Globe, Mail, MessageSquare].map((Icon, idx) => (
                          <div key={idx} className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-primary text-white/70 hover:text-white transition-all transform hover:scale-110">
                            <Icon size={14} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-8 text-center relative z-10">
                    <div className="w-10 h-[1px] bg-primary/30 mx-auto mb-4 group-hover:w-20 transition-all" />
                    <h3 className="text-xl font-display font-bold mb-1 group-hover:text-primary transition-colors tracking-tight flex items-center justify-center gap-2">
                      {member.name}
                      {member.isVerified && (
                        <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-lg" title="Verified Member">
                          <Star size={8} fill="currentColor" />
                        </div>
                      )}
                      {member.role === 'Leader' && (
                        <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-mono rounded border border-primary/20 align-middle">
                          LEADER
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-col items-center justify-center gap-1">
                       <p className="text-primary font-mono text-[9px] uppercase tracking-[0.2em]">{member.designation || 'Squad Member'}</p>
                       <p className="text-white/20 text-[8px] uppercase tracking-widest">{member.team || 'Member'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* CTA Section - Pipeline Kit often has a Footer CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-40 p-12 md:p-20 glass rounded-[3rem] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Want to work with us?</h2>
        <p className="text-white/60 mb-10 max-w-xl mx-auto">
          We’re always looking for talented individuals who share our passion 
          for building the future of the digital world.
        </p>
        <Link to="/contact">
          <Button className="px-10">Get In Touch</Button>
        </Link>
      </motion.div>
    </div>
  );
}
