import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, SectionHeading, Button } from '../components/UI';
import axios from 'axios';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
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
                      src={project.image && project.image !== "" ? project.image : undefined} 
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
                    <div className="flex flex-wrap gap-2">
                      {project.techStack && project.techStack.map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 glass rounded-md text-[9px] font-mono uppercase tracking-widest text-primary/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
