import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Button, Card, SectionHeading } from '../components/UI';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <SectionHeading 
        title="Let's Build Something Great" 
        subtitle="Contact Us" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="space-y-12"
        >
          <p className="text-2xl text-white/60 leading-relaxed max-w-lg">
            Have a project in mind? We'd love to hear from you. 
            Send us a message and we'll get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            {[
              { icon: Mail, label: 'Email', val: 'hello@elesquad.com' },
              { icon: Phone, label: 'Phone', val: '+880 1234 567 890' },
              { icon: MapPin, label: 'Location', val: 'Dhaka, Bangladesh' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <item.icon className="text-primary group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">{item.label}</h4>
                  <p className="text-xl font-bold">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-8 md:p-12" tiltEnabled={false}>
            {submitted ? (
              <div className="py-20 text-center animate-fade-up">
                <CheckCircle size={80} className="text-primary mx-auto mb-6" />
                <h3 className="text-3xl font-display font-bold mb-4">Message Sent!</h3>
                <p className="text-white/60 mb-8">We've received your inquiry and will be in touch shortly.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-white/40 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-mono text-white/40 uppercase tracking-widest pl-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-mono text-white/40 uppercase tracking-widest pl-1">Message</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-lg resize-none"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Message'} <Send size={20} className="ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
