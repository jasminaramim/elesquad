import ThreeWave from './ThreeWave';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, ArrowRight, Send } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Telegram } from './BrandIcons';

export default function Footer() {
  return (
    <footer className="relative bg-[#020205] border-t border-white/5 py-[80px] lg:py-[100px] overflow-hidden group/footer">
      {/* 3D Interactive Wave Background */}
      <ThreeWave opacity={0.15} />

      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo & Info */}
          <div className="md:col-span-3 space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl md:text-3xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6C4DF6] to-pink-500">
                EleSquad
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              We build high-performance digital experiences that help brands grow in the modern world. Innovative design meets elite engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-6 lg:pl-10">
            <h4 className="text-lg font-bold text-white flex flex-col items-start">
              <span className="border-b-[3px] border-[#6C4DF6] pb-2">Quick Links</span>
            </h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Projects', 'Team', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-3">
                    <span className="text-[#6C4DF6] text-xs">{"\u00BB"}</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-lg font-bold text-white flex flex-col items-start">
              <span className="border-b-[3px] border-[#6C4DF6] pb-2">Our Services</span>
            </h4>
            <ul className="space-y-4">
              {['WordPress', 'Elementor', 'Gutenberg', 'WooCommerce', 'SEO Expert'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-3">
                    <span className="text-[#6C4DF6] text-xs">{"\u00BB"}</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-lg font-bold text-white flex flex-col items-start">
              <span className="border-b-[3px] border-[#6C4DF6] pb-2">Newsletter</span>
            </h4>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Sign up to our weekly newsletter to get the latest updates.
            </p>
            <div className="relative group/input mt-4">
              <input 
                type="email" 
                placeholder="Enter Email Address" 
                className="w-full bg-transparent border border-white/10 rounded-lg pl-4 pr-14 py-3.5 text-sm focus:outline-none focus:border-[#6C4DF6]/50 transition-colors text-white placeholder-white/20"
              />
              <button className="absolute right-2 top-2 bottom-2 w-10 bg-[#6C4DF6] rounded-md flex items-center justify-center hover:opacity-90 transition-opacity">
                <Send size={16} className="text-white -ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-[10px] text-white/35 font-mono tracking-[0.25em] uppercase">
            © {new Date().getFullYear()} ELESQUAD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
