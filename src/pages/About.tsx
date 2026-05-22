import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SectionHeading, Card } from '../components/UI';
import CTASection from '../components/CTASection';
import { Target, Rocket, Users, ShieldCheck, ChevronDown, Star, MessageSquare, Quote, Layout, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const stats = [
  { label: 'Founded', val: '2022' },
  { label: 'Projects', val: '150+' },
  { label: 'WP Sites', val: '100+' },
  { label: 'Team', val: '12' },
];

const values = [
  { icon: Target, title: 'Precision', desc: 'Crafting pixel-perfect Elementor layouts and clean Gutenberg functionality.' },
  { icon: Rocket, title: 'Speed', desc: 'Optimizing backend performance and frontend rendering for blazing fast UX.' },
  { icon: Users, title: 'Support', desc: 'Expert maintenance and troubleshooting for WordPress and custom app ecosystems.' },
  { icon: ShieldCheck, title: 'Security', desc: 'Enterprise-grade protection for WooCommerce stores and digital identities.' },
];

const faqs = [
  { q: 'Do you provide custom WordPress theme development?', a: 'Yes, we specialize in building pixel-perfect custom WordPress themes from scratch, tailored specifically to your brand identity and functional requirements.' },
  { q: 'Can you convert my Figma/Adobe XD design to Elementor?', a: 'Absolutely! We take your high-fidelity designs and transform them into fully responsive, interactive Elementor Pro layouts that match the design exactly.' },
  { q: 'How do you ensure the website speed is optimized?', a: 'We implement advanced caching, image compression (WebP), LCP optimization, and clean coding practices to ensure your site loads blazingly fast on all devices.' },
  { q: 'Do you offer ongoing maintenance and support?', a: 'Yes, we provide regular updates, security monitoring, and technical troubleshooting to keep your WordPress ecosystem running smoothly.' },
];

export default function About() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [aboutUsImage, setAboutUsImage] = useState<string>('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop');
  const [aboutUsTitle, setAboutUsTitle] = useState<string>('');
  const [aboutUsDescription, setAboutUsDescription] = useState<string>('');
  const [foundedYear, setFoundedYear] = useState<string>('');
  const [projectsCount, setProjectsCount] = useState<string>('');
  const [totalClients, setTotalClients] = useState<string>('');
  const [totalReviews, setTotalReviews] = useState<string>('');

  useEffect(() => {
    axios.get('/api/reviews').then(res => setReviews(res.data));
    axios.get('/api/about').then(res => {
      if (res.data?.aboutUsImage) setAboutUsImage(res.data.aboutUsImage);
      if (res.data?.aboutUsTitle) setAboutUsTitle(res.data.aboutUsTitle);
      if (res.data?.aboutUsDescription) setAboutUsDescription(res.data.aboutUsDescription);
      if (res.data?.foundedYear) setFoundedYear(res.data.foundedYear);
      if (res.data?.projectsCount) setProjectsCount(res.data.projectsCount);
      if (res.data?.totalClients) setTotalClients(res.data.totalClients);
      if (res.data?.totalReviews) setTotalReviews(res.data.totalReviews);
    }).catch(console.error);
  }, []);

  return (
    <div className="pb-[50px] lg:pb-[100px]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Intro */}
        <section className="pt-[20px] md:pt-[50px] pb-[50px] lg:pb-[100px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeading title={aboutUsTitle || "WordPress, Woodmart & Page Builder Experts"} subtitle="Who We Are" />
            <p className="text-[14px] md:text-[18px] text-white/60 leading-relaxed mb-8 whitespace-pre-wrap">
              {aboutUsDescription || "Elesquad are elite experts in WordPress Frontend & Backend, WooCommerce Functionality,\nWoodmart Premium themes, Gutenberg, and Elementor Pro."}
            </p>
            <p className="text-[14px] md:text-[18px] text-white/40 leading-relaxed max-w-lg mb-12">
              We bridge the gap between creative design and complex backend infrastructure.
              Whether it's a high-converting eCommerce store or a custom frontend application,
              we deliver results that matter.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Founded', val: foundedYear || '2022' },
                { label: 'Projects', val: projectsCount || '150+' },
                { label: 'Clients', val: totalClients || '100+' },
                { label: 'Reviews', val: totalReviews || '12' },
              ].map((s, i) => (
                <div key={i}>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">{s.val}</h4>
                  <p className="text-xs font-mono uppercase tracking-widest text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="p-0 overflow-hidden" tiltEnabled={true}>
              <img
                src={aboutUsImage}
                alt="Team at work"
                className="w-full aspect-square object-cover"
              />
            </Card>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full z-[-1]" />
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="py-[50px] lg:py-[100px]">
          <SectionHeading title="Our Core Values" subtitle="What Drives Us" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full group">
                  <v.icon size={40} className="text-primary mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  <h4 className="text-2xl font-bold mb-4">{v.title}</h4>
                  <p className="text-white/60 leading-relaxed">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
      {/* Dynamic Review Carousel (Homepage Design) - FULL WIDTH */}
      <section className="pt-[50px] lg:pt-[100px] pb-0 relative overflow-hidden bg-none">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-20">
          <SectionHeading title="What Our Clients Say" subtitle="Reviews" centered />
        </div>

        <div className="relative overflow-hidden group">
          <motion.div
            animate={{
              x: reviews.length > 0 ? ["0%", `-${(reviews.length * 450) / 15}%`] : "0%"
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex gap-8 px-4 pb-20 no-scrollbar select-none"
          >
            {[...reviews, ...reviews].map((review, i) => (
              <motion.div
                key={`${review._id}-${i}`}
                className="min-w-[350px] md:min-w-[450px]"
              >
                <Card className="p-10 h-full flex flex-col gap-6 bg-white/[0.03] border-white/5 relative hover:border-primary/30 transition-all">
                  <MessageSquare size={40} className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

                  <div className="flex text-primary gap-1">
                    {[...Array(review.rating || 5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>

                  <h4 className="text-xl font-bold">{review.title || 'Exceptional Results'}</h4>
                  <p className="text-white/60 leading-relaxed italic text-lg">"{review.feedback}"</p>

                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden">
                      {review.image ? <img src={review.image} className="w-full h-full object-cover" /> : (review.clientName || 'C')[0]}
                    </div>
                    <div>
                      <h5 className="font-bold">{review.clientName}</h5>
                      <p className="text-[10px] uppercase text-white/20 tracking-widest">Verified Client</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Subtle gradient fades for the carousel */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* Reusable CTA Section */}
      <CTASection />

    </div>
  );
}


