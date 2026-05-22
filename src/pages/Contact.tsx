import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-bg min-h-[90vh] flex items-center justify-center">
      <style>
        {`
          @keyframes borderBeam {
            0% { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }
        `}
      </style>
      <div className="max-w-6xl w-full mx-auto px-5 md:px-10">
        
        {/* Animated Border Wrapper */}
        <div className="relative rounded-[2rem] p-[3px] group shadow-[0_0_60px_rgba(108,77,246,0.1)]">
          
          {/* Main Container */}
          <div className="relative bg-[#050505] rounded-[2rem] overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[700px] z-10">
            
            {/* Exact Border Beam Overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border-[3px] border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] z-20">
              <div 
                className="absolute aspect-square bg-gradient-to-l from-[#6C4DF6] via-[#6C4DF6] to-transparent w-[300px] h-[300px] opacity-100" 
                style={{
                  offsetPath: "rect(0 auto auto 0 round 2rem)",
                  animation: "borderBeam 8s linear infinite"
                }}
              />
              <div 
                className="absolute aspect-square bg-gradient-to-l from-[#6C4DF6] via-[#6C4DF6] to-transparent w-[300px] h-[300px] opacity-100" 
                style={{
                  offsetPath: "rect(0 auto auto 0 round 2rem)",
                  animation: "borderBeam 8s linear infinite",
                  animationDelay: "-4s"
                }}
              />
            </div>

            {/* Left Side: Form */}
            <div className="flex-1 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative">
              
              <div className="mb-10">
                <p className="text-[#6C4DF6] text-[10px] font-black uppercase tracking-widest mb-4">Let's Connect</p>
                <h2 className="text-4xl md:text-[44px] font-bold text-white mb-6 tracking-tight leading-[1.1]">Request a Quote</h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  By delivering superior digital solutions, we continuously surpass our clients' expectations. Get in touch with us for a free quote!
                </p>
              </div>

              {submitted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <CheckCircle size={64} className="text-[#6C4DF6] mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                  <p className="text-white/40 mb-8">We'll get back to you as soon as possible.</p>
                  <button onClick={() => setSubmitted(false)} className="px-8 py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-[#6C4DF6]/50 transition-all text-white/80 text-[13px] placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-[#6C4DF6]/50 transition-all text-white/80 text-[13px] placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-[#6C4DF6]/50 transition-all text-white/80 text-[13px] placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-[#6C4DF6]/50 transition-all text-white/80 text-[13px] placeholder:text-white/20 resize-none"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full border border-[#6C4DF6]/30 hover:border-[#6C4DF6] hover:bg-[#6C4DF6]/10 text-white font-bold py-4 rounded-xl transition-all duration-300 text-[11px] uppercase tracking-widest disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Side: Image & Reviews */}
            <div className="flex-1 relative hidden lg:block border-l border-white/5 bg-[#111]">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                alt="Team working"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
              
              {/* Reviews Card Overlay */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] max-w-sm bg-[#050505]/90 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex items-center gap-5 shadow-2xl">
                <div className="flex -space-x-3">
                  <img src="https://i.pravatar.cc/100?img=33" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="Reviewer" />
                  <img src="https://i.pravatar.cc/100?img=47" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="Reviewer" />
                  <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="Reviewer" />
                  <img src="https://i.pravatar.cc/100?img=68" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="Reviewer" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg leading-none mb-1">250+</h4>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">5-Star Client Reviews</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
