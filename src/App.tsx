/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Team from './pages/Team';
import TeamMemberDetails from './pages/TeamMemberDetails';
import Reviews from './pages/Reviews';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import TechBackground from './components/TechBackground';
import CustomCursor from './components/CustomCursor';

import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pt-20 min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <div className="relative overflow-x-hidden bg-bg min-h-screen text-foreground cursor-none transition-colors duration-300">
              <CustomCursor />
              <TechBackground />

              <Navbar />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/team/:id" element={<TeamMemberDetails />} />
                  <Route path="/reviews" element={<Reviews />} />

                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/editor/:id" element={<DocumentEditor />} />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </PageTransition>
              <Footer />
              <Toaster position="bottom-right" toastOptions={{
                className: 'glass',
                style: {
                  background: 'var(--color-bg)',
                  color: 'var(--color-foreground)',
                  border: '1px solid var(--color-border)',
                  backdropFilter: 'blur(10px)'
                }
              }} />
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

