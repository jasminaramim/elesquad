import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Phone, MessageSquare, Globe, Smartphone, Shield, Layout, Palette, Code } from 'lucide-react';
import axios from 'axios';
import { Card, Button, SectionHeading } from '../components/UI';

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [otherServices, setOtherServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resService, resAll] = await Promise.all([
          axios.get(`/api/services/${id}`),
          axios.get('/api/services')
        ]);
        setService(resService.data);
        setOtherServices(resAll.data.filter((s: any) => s._id !== id).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch service details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) return <div className="min-h-screen flex items-center justify-center text-white/40">Service not found.</div>;

  const carouselImages = service.images ? service.images.split(',').map((s: string) => s.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] md:py-[70px] lg:py-[120px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Content */}
        <div className="lg:col-span-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 tracking-tighter">{service.title}</h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-2xl mb-12">
              {service.subtitle || "A website should be more than just beautiful—it should be strategic, high-performing, and built to convert."}
            </p>

            <div className="aspect-[16/10] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative group">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>

          <div className="space-y-8 text-lg text-white/60 leading-relaxed">
            <p>{service.description}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold">High-Performance Development</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Lightning-fast loading speeds for better user experience',
                'SEO-optimized structure to rank higher on search engines',
                'Secure and scalable platforms for long-term success',
                'Modern UI/UX principles for smooth navigation'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-primary shrink-0" />
                  <span className="text-white/60 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Section */}
          {carouselImages.length > 0 && (
            <div className="space-y-8 pt-8">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={carouselImages[activeImage]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveImage(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1))}
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-primary transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setActiveImage(prev => (prev === carouselImages.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-primary transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2">
                  {carouselImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? 'bg-primary w-6' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Other Services Card */}
          <Card className="p-8 border-white/5" tiltEnabled={false}>
            <h4 className="text-xl font-bold mb-8">Other Services</h4>
            <div className="space-y-4">
              {otherServices.map((s: any) => (
                <Link
                  key={s._id}
                  to={`/services/${s._id}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <span className="font-bold text-white/70 group-hover:text-white transition-colors">{s.title}</span>
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* CTA Card */}
          <Card className="p-8 bg-primary border-none shadow-[0_20px_50px_rgba(108,77,246,0.3)] relative overflow-hidden group" tiltEnabled={false}>
            <div className="relative z-10 text-center space-y-6">
              <h4 className="text-3xl font-display font-bold leading-tight">Any Question? Let's Talk</h4>
              <p className="text-white/70 text-sm">Our elite squad is ready to transform your vision into reality.</p>

              <Link to="/contact">
                <Button className="w-full bg-white text-black hover:bg-white hover:text-primary py-5 flex items-center justify-center gap-3 group/btn">
                  Let's Talk

                </Button>
              </Link>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
          </Card>
        </aside>

      </div>
    </div>
  );
}
