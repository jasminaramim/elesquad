import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react';
import { Modal } from '../components/UI';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState({ show: false, title: '', message: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('elesquad_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed._id && !parsed.id) parsed.id = parsed._id;
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('elesquad_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const isLocal = window.location.hostname === 'localhost';
    const socketUrl = isLocal ? 'http://localhost:3000' : window.location.origin;
    
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      socket.emit('join_room', `user_${user.id}`);
    });

    socket.on('force_logout', () => {
      console.warn('FORCE LOGOUT RECEIVED: Account restricted or session terminated.');
      
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      
      setLogoutModal({
        show: true,
        title: 'Access Restricted',
        message: 'Your access level has been changed by an administrator. For security reasons, you have been logged out of the squad dashboard.'
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  // Polling fallback for Serverless environments (like Vercel) where Sockets are not persistent
  useEffect(() => {
    if (!user?.id || isLoading) return;

    const validateSession = async () => {
      try {
        // Aggressive Cache busting and explicit check
        const res = await axios.get(`/api/users/${user.id}?t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });

        // Instant Logout if role was downgraded
        if (res.data.role && res.data.role !== 'Leader' && res.data.role !== 'Member') {
          console.warn('FORCE LOGOUT: Role downgraded to restricted status.');
          
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);

          setLogoutModal({
            show: true,
            title: 'Session Terminated',
            message: "Your profile has been updated to a restricted role. You no longer have access to the EleSquad inner circle."
          });
        }
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 401) {
          console.warn('FORCE LOGOUT: User record purged from database.');
          
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);

          setLogoutModal({
            show: true,
            title: 'Account Deactivated',
            message: "It seems your account is no longer active in the EleSquad database. Please contact leadership if you believe this is an error."
          });
        }
      }
    };

    // Initial check
    validateSession();

    // Poll every 1 second for "Instant" feel
    const interval = setInterval(validateSession, 1000);
    return () => clearInterval(interval);
  }, [user?.id, isLoading]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'elesquad_user' && !e.newValue) {
        console.log('Detected logout in another tab. Synchronizing...');
        setUser(null);
        window.location.href = '/';
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData: any) => {
    // Ensure id is present
    const normalizedUser = { ...userData, id: userData.id || userData._id };
    setUser(normalizedUser);
    localStorage.setItem('elesquad_user', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elesquad_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
      <Modal 
        isOpen={logoutModal.show} 
        onClose={() => window.location.href = '/'} 
        title={logoutModal.title}
        icon={ShieldAlert}
      >
        {logoutModal.message}
      </Modal>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
