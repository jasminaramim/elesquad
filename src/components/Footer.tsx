import ThreeWave from './ThreeWave';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#020205] border-t border-white/5 py-[80px] lg:py-[100px] overflow-hidden group/footer">
      {/* 3D Interactive Wave Background */}
      <ThreeWave opacity={0.15} />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo & Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-4 group/logo">
              <span className="text-3xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(108,77,246,0.4)]">
                EleSquad
              </span>
            </Link>
            <p className="text-base text-white/50 max-w-sm leading-relaxed font-light">
              We build high-performance digital experiences that help brands grow in the modern world. 
              Innovative design meets elite engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white tracking-tight">Quick Links</h4>
              <div className="w-12 h-[3px] bg-primary rounded-full"></div>
            </div>
            <ul className="space-y-3 pt-2">
              {['Home', 'About', 'Projects', 'Team', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-white/50 hover:text-primary transition-colors text-sm flex items-center gap-2.5 font-medium group"
                  >
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">»</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white tracking-tight">Our Services</h4>
              <div className="w-12 h-[3px] bg-primary rounded-full"></div>
            </div>
            <ul className="space-y-3 pt-2">
              {['WordPress', 'Elementor', 'Gutenberg', 'WooCommerce', 'SEO Expert'].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-white/50 hover:text-primary transition-colors text-sm flex items-center gap-2.5 font-medium group"
                  >
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">»</span> {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white tracking-tight">Newsletter</h4>
              <div className="w-12 h-[3px] bg-primary rounded-full"></div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed font-light pt-2">
              Sign up to our weekly newsletter to get the latest updates.
            </p>
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input 
                type="email" 
                placeholder="Enter Email Address" 
                className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none text-white placeholder-white/40"
              />
              <button className="bg-primary hover:opacity-90 rounded-xl p-3 text-white flex items-center justify-center transition-all shrink-0 shadow-[0_0_15px_rgba(108,77,246,0.4)]">
                <Send size={16} />
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
