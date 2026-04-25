import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Globe, Share2, ArrowRight, CheckCircle } from 'lucide-react';
import { Button, Card } from '../components/UI';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Facebook, Instagram, Linkedin, Telegram } from '../components/BrandIcons';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-0 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] md:py-[70px] lg:py-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Side: Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-[#0A0A0C]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 md:p-14 h-full relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
              
              <div className="relative z-10 space-y-12">
                {/* Phone */}
                <div>
                  <h3 className="text-primary text-3xl font-bold mb-6">+880 1234 567 890</h3>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="text-white text-xl font-bold">Address</h4>
                  <div className="space-y-2">
                    <p className="text-white/50 text-sm leading-relaxed">
                      Dhaka, Bangladesh
                    </p>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Creative Digital Hub
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Email */}
                <div className="space-y-4">
                  <h4 className="text-white text-xl font-bold">Email</h4>
                  <div className="space-y-2">
                    <p className="text-white/50 text-sm">hello@elesquad.pro</p>
                    <p className="text-white/50 text-sm">support@elesquad.pro</p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Socials */}
                <div className="space-y-6">
                  <h4 className="text-white text-xl font-bold">Follow</h4>
                  <div className="flex gap-4">
                    {[Telegram, Facebook, Linkedin, Instagram].map((Icon, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        className="w-10 h-10 rounded-full bg-white border border-white flex items-center justify-center text-black hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 flex flex-col justify-center"
          >
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary rounded-full mb-8">
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Get In Touch</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-8">
                Get started and grow your <br/>
                business now.
              </h2>
              <p className="text-white/40 text-lg max-w-xl">
                Start today to unlock opportunities and drive your business toward success.
              </p>
            </div>

            {submitted ? (
              <div className="bg-white/5 rounded-3xl p-12 text-center border border-white/5">
                <CheckCircle size={64} className="text-primary mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                <p className="text-white/40 mb-8">We'll get back to you as soon as possible.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#121214] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#121214] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-white font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#121214] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <textarea 
                    placeholder="Message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#121214] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-white font-bold resize-none"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:opacity-90 text-white font-bold py-5 rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Full Width Map Section */}
      <div className="w-full h-[600px] relative mt-20">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-white text-sm font-medium px-4 py-2 bg-black/60 rounded-lg backdrop-blur-md">
            Use ctrl + scroll to zoom the map
          </p>
        </div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.272951868!2d90.375862!3d23.746466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
          className="w-full h-full border-0 grayscale invert brightness-50 contrast-125"
          allowFullScreen 
          loading="lazy" 
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-6 opacity-50" alt="Google" />
        </div>
      </div>
    </div>
  );
}
