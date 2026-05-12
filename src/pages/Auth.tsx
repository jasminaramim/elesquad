import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/UI';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LogIn, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email: formData.email, password: formData.password });
      login(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || res.data.user.email}!`);
      
      // If the user is a Leader (Admin), navigate to Admin Dashboard
      if (res.data.user.role === 'Leader') {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === 'Member') {
        navigate('/dashboard');
      } else {
        // User/Viewer role - allowed to log in but no dashboard
        toast.success(`Logged in as ${res.data.user.role}`);
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 bg-bg relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="p-10 border-white/10 glass">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-bold mb-4">Member Login</h2>
            <p className="text-white/40 text-sm">
              Access your professional dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary transition-all text-white text-sm"
                placeholder="member@elesquad.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 outline-none focus:border-primary transition-all text-white text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Login
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/20 text-[10px] uppercase tracking-widest">
              EleSquad Authorized Personnel Only
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
