import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user || user.role !== 'Leader') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
