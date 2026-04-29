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
import AdminMemberDetails from './pages/admin/AdminMemberDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import TechBackground from './components/TechBackground';
import QuantumBackground from './components/QuantumBackground';
import ServiceDetails from './pages/ServiceDetails';
import Contact from './pages/Contact';

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
            <div className="relative overflow-x-hidden bg-bg min-h-screen text-foreground transition-colors duration-300">
              <QuantumBackground />
              
              {/* Global Overlay UI & Scanlines */}
              <div className="fixed inset-0 pointer-events-none z-20 opacity-20" style={{ 
                background: 'linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%'
              }}></div>

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
                  <Route path="/services/:id" element={<ServiceDetails />} />
                  <Route path="/contact" element={<Contact />} />

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
                  <Route 
                    path="/admin/members/:id" 
                    element={
                      <ProtectedRoute>
                        <AdminMemberDetails />
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

