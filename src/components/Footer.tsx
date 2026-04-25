import ThreeWave from './ThreeWave';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Telegram } from './BrandIcons';

export default function Footer() {
  return (
    <footer className="relative bg-bg border-t border-border pt-32 pb-12 overflow-hidden group/footer">
      {/* 3D Interactive Wave Background */}
      <ThreeWave opacity={0.2} />

      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          {/* Logo & Info */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-4 group/logo">
              <span className="text-3xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(108,77,246,0.4)]">
                EleSquad
              </span>
            </Link>
            <p className="text-lg text-foreground/50 max-w-sm leading-relaxed font-light">
              We build high-end digital experiences that help brands grow in the modern world. 
              Innovative design meets elite engineering.
            </p>
            <div className="flex gap-4">
              {[Telegram, Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 glass border border-border rounded-2xl flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 text-foreground group">
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-white/30">Explore</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Projects', 'Team', 'Reviews'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-white/30">Connect</h4>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li className="flex items-center gap-3"><Mail size={16} className="text-primary" /> hello@elesquad.pro</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-primary" /> +880 123 456 789</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-primary" /> Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Newsletter/CTA */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-white/30">Newsletter</h4>
            <div className="relative group/input">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                Join
              </button>
            </div>
            <p className="text-[10px] text-white/20 italic">Join our elite squad of innovators.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-xs text-white/20 font-mono tracking-wider">
            © {new Date().getFullYear()} ELESQUAD. ENGINEERED FOR EXCELLENCE.
          </p>
          <div className="flex gap-8 text-xs text-white/20 uppercase tracking-widest font-bold">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/admin" className="hover:text-primary transition-colors">Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
