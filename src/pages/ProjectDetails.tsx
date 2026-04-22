import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Globe, CheckCircle } from 'lucide-react';
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

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl shimmer">Loading Experience...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center text-2xl">Project Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <Link to="/projects">
        <Button variant="outline" className="mb-12">
          <ArrowLeft className="mr-2" size={18} /> Back to Projects
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-0 overflow-hidden" tiltEnabled={true}>
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">{project.title}</h1>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            {project.description}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="text-primary font-mono text-xs uppercase tracking-widest mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech: string) => (
                  <span key={tech} className="px-4 py-2 glass rounded-xl text-sm font-medium">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-primary font-mono text-xs uppercase tracking-widest mb-4">Key Features</h4>
              <ul className="space-y-3">
                {['High Performance', 'Premium UI', 'Responsive', 'Secure'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircle size={14} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <a href={project.liveLink} target="_blank" rel="noreferrer">
              <Button>Live Demo <ExternalLink size={18} className="ml-2" /></Button>
            </a>
            <a href={project.githubLink} target="_blank" rel="noreferrer">
              <Button variant="outline">View Code <Globe size={18} className="ml-2" /></Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Placeholder for more details */}
      <section className="mt-32">
        <h3 className="text-3xl font-display font-bold mb-12">The Challenge</h3>
        <Card className="p-12 leading-relaxed text-white/60 text-lg">
          Building a premium digital experience requires a delicate balance between visual aesthetics 
          and technical performance. Our goal with this project was to push the boundaries of modern web standards, 
          integrating complex animations with seamless user interaction. 
          The final product stands as a testament to our commitment to quality and innovation.
        </Card>
      </section>
    </div>
  );
}
