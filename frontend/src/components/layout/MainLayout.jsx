import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const titles = {
      '/overview': 'VibeGuard AI | Overview',
      '/dashboard': 'VibeGuard AI | Dashboard',
      '/machines': 'VibeGuard AI | Machines',
      '/readings': 'VibeGuard AI | Telemetry Readings',
      '/readings/new': 'VibeGuard AI | Add Reading',
      '/alerts': 'VibeGuard AI | Alerts',
      '/analytics': 'VibeGuard AI | Analytics',
      '/oee': 'VibeGuard AI | OEE Dashboard',
      '/maintenance': 'VibeGuard AI | Maintenance',
      '/history': 'VibeGuard AI | History',
      '/profile': 'VibeGuard AI | Profile',
      '/settings': 'VibeGuard AI | Settings',
    };
    const title = titles[location.pathname] || 'VibeGuard AI | Industrial Condition Monitoring';
    document.title = title;
  }, [location.pathname]);

  useEffect(() => {
    const blob = document.getElementById('magnetic-blob');
    if (!blob) return;

    const handleMouseMove = (e) => {
      if (!document.body.classList.contains('mouse-active')) {
        document.body.classList.add('mouse-active');
      }
      blob.style.left = `${e.clientX}px`;
      blob.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased selection:bg-[var(--info)] selection:text-white relative overflow-x-hidden">
      <div id="magnetic-blob" />

      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Fixed Desktop & Mobile Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        closeMobileMenu={closeMobileMenu}
      />

      {/* Main Wrapper with Dynamic Left Padding for Desktop Sidebar */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Topbar Header */}
        <Topbar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Dynamic Page Content with Framer Motion Transition */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
