import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
];

  export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 h-[72px] flex items-center z-50 transition-all duration-300 px-4 md:px-10",
      scrolled ? "bg-bg/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    )}>
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
             {/* Custom Infinity Logo SVG style */}
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(180,60,255,0.5)]">
               <defs>
                 <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#8A46FF" />
                   <stop offset="50%" stopColor="#C43BFF" />
                   <stop offset="100%" stopColor="#FF3BD0" />
                 </linearGradient>
               </defs>
               <path 
                 d="M30 50 C 30 35 45 35 50 50 C 55 65 70 65 70 50 C 70 35 55 35 50 50 C 45 65 30 65 30 50" 
                 fill="none" 
                 stroke="url(#logoGradient)" 
                 strokeWidth="10" 
                 strokeLinecap="round"
                 className="animate-pulse"
               />
             </svg>
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter text-white">
            Ele<span className="text-primary italic">Squad</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-white capitalize",
                location.pathname === link.path ? "text-white" : "text-gray-400"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <Link
            to={user ? (user.role === 'Leader' ? "/admin/dashboard" : "/dashboard") : "/auth"}
            className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:bg-primary hover:text-white transition-all shadow-lg flex items-center gap-2"
          >
            {user && <User size={14} />}
            {user ? (user.role === 'Leader' ? 'Admin Hub' : 'Dashboard') : 'Hire Us'}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-xl font-display font-medium",
                    location.pathname === link.path ? "text-primary" : "text-white/70"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="w-full py-4 bg-primary rounded-xl text-center font-bold"
                onClick={() => setIsOpen(false)}
              >
                Hire Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
