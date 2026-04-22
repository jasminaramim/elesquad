import React, { createContext, useContext, useState, useEffect } from 'react';

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
        // Normalize _id to id if necessary
        if (parsed._id && !parsed.id) parsed.id = parsed._id;
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('elesquad_user');
      }
    }
    setIsLoading(false);
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
