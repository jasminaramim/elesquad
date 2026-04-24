import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Button } from './UI';
import { Sun, Moon, Bell } from 'lucide-react';


const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Team', path: '/team' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, resetUnread } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 flex items-center z-50 transition-all duration-300 px-4 py-[15px] md:px-10",
      scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    )}>
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(108,77,246,0.4)]">
            EleSquad
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-primary capitalize",
                location.pathname === link.path ? "text-primary" : "text-foreground/60"
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface transition-colors text-foreground"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) resetUnread();
              }}
              className="relative p-2 rounded-full hover:bg-surface transition-colors"
            >
              <Bell size={20} className={cn("transition-colors", unreadCount > 0 ? "text-primary" : "text-foreground/60")} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass border border-border rounded-2xl p-4 shadow-2xl z-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-foreground/40 hover:text-primary">Close</button>
                  </div>
                  {unreadCount > 0 ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Bell size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Messages</p>
                          <p className="text-xs text-foreground/60">You have {unreadCount} unread messages in your chat room.</p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowNotifications(false)}
                        className="block w-full py-2 text-center text-xs font-bold bg-primary rounded-lg text-white hover:opacity-90 transition-opacity"
                      >
                        View Messages
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Bell size={32} className="mx-auto text-foreground/10 mb-2" />
                      <p className="text-sm text-foreground/40">No new notifications</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            to={user ? (user.role === 'Leader' ? "/admin/dashboard" : "/dashboard") : "/auth"}
            className="group/navbtn relative px-1 py-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-primary transition-all duration-500 flex items-center min-w-[50px] overflow-hidden"
          >
            {user ? (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-white/10">
                  {user.image && user.image !== "" ? (
                    <img src={user.image} className="w-full h-full object-cover" alt={user.name} />
                  ) : (
                    <span className="text-white font-bold">{user.name[0]}</span>
                  )}
                </div>
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover/navbtn:max-w-[150px] group-hover/navbtn:ml-3 group-hover/navbtn:mr-4 transition-all duration-500 text-sm font-bold text-white">
                  {user.name}
                </span>
              </div>
            ) : (
              <span className="px-6 py-2 text-white font-bold text-sm">Login</span>
            )}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-foreground/60">
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[50vw] bg-black z-[70] md:hidden shadow-2xl flex flex-col"
            >
              <div className="flex flex-col h-full p-8">
                <div className="flex justify-between items-center mb-12">
                  <span className="text-2xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    EleSquad
                  </span>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-white">
                    <X size={28} />
                  </button>
                </div>

                <div className="flex flex-col gap-8">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          "text-4xl font-display font-bold tracking-tighter transition-colors",
                          location.pathname === link.path ? "text-primary" : "text-white/40"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                  <Link
                    to={user ? (user.role === 'Leader' ? "/admin/dashboard" : "/dashboard") : "/auth"}
                    className="w-full py-5 bg-primary rounded-2xl text-center font-bold text-lg text-white flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(108,77,246,0.3)]"
                    onClick={() => setIsOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/10">
                          {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name[0]}
                        </div>
                        {user.name}
                      </>
                    ) : 'Login'}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
