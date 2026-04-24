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
      <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
        <SectionHeading 
          title="Let's Build Something Great" 
          subtitle="Contact Us" 
          className="mb-0"
        />
        <div className="hidden lg:block text-right">
          <p className="text-primary font-mono text-sm uppercase tracking-widest mb-2">Available 24/7</p>
          <p className="text-white/40 text-xs">Ready to start your next masterpiece.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Contact Info Sidebar */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="lg:col-span-4 space-y-12"
        >
          <div className="space-y-10">
            {[
              { icon: Mail, label: 'Email Address', val: 'hello@elesquad.pro', sub: 'For inquiries & support' },
              { icon: Phone, label: 'Phone Number', val: '+880 1234 567 890', sub: 'WhatsApp & Direct Call' },
              { icon: MapPin, label: 'Headquarters', val: 'Dhaka, Bangladesh', sub: 'Visit our creative hub' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-500 shrink-0">
                  <item.icon className="text-primary" size={22} />
                </div>
                <div>
                  <h4 className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{item.label}</h4>
                  <p className="text-xl font-bold mb-1">{item.val}</p>
                  <p className="text-white/20 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links placeholder */}
          <div className="pt-10 border-t border-white/5">
             <h4 className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Social Ecosystem</h4>
             <div className="flex gap-4">
                {['TW', 'GH', 'LN', 'IG'].map(s => (
                  <div key={s} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold hover:bg-primary hover:border-primary transition-all cursor-pointer">
                    {s}
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Contact Form & Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 space-y-8"
        >
          <Card className="p-8 md:p-12 border-white/5 shadow-2xl" tiltEnabled={false}>
            {submitted ? (
              <div className="py-20 text-center animate-fade-up">
                <CheckCircle size={80} className="text-primary mx-auto mb-6" />
                <h3 className="text-4xl font-display font-bold mb-4">Message Synced!</h3>
                <p className="text-white/60 mb-8 max-w-sm mx-auto">Our squad has received your transmission. Expect a response shortly.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Transmit Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Email Connection</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Your Vision</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your masterpiece..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base resize-none"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full py-5 text-lg shadow-[0_10px_30px_rgba(108,77,246,0.3)]">
                  {loading ? 'Transmitting...' : 'Send Transmission'} <Send size={20} className="ml-3" />
                </Button>
              </form>
            )}
          </Card>

          {/* Interactive Map Placeholder */}
          <div className="h-80 w-full rounded-[2.5rem] overflow-hidden border border-white/5 relative group">
             <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl flex items-center justify-center z-10 group-hover:bg-transparent transition-all duration-700">
                <div className="text-center">
                   <MapPin size={40} className="text-primary mx-auto mb-4 animate-bounce" />
                   <p className="text-xs font-bold uppercase tracking-widest text-white/40">View Interactive Map</p>
                </div>
             </div>
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.272951868!2d90.375862!3d23.746466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
               className="w-full h-full border-0 grayscale invert brightness-75 contrast-125 opacity-50"
               allowFullScreen 
               loading="lazy" 
             />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
