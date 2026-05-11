import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

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
      console.warn('FORCE LOGOUT RECEIVED: Account deleted or suspended.');
      setUser(null);
      localStorage.removeItem('elesquad_user');
      toast.error('Your account has been deleted or suspended by an administrator.', {
        duration: 6000,
        icon: '⚠️'
      });
      window.location.href = '/';
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

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
