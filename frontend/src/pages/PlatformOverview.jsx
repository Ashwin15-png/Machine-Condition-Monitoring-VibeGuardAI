import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import HeroSection from '../components/platform/HeroSection';
import ProblemStatement from '../components/platform/ProblemStatement';
import ArchitectureFlow from '../components/platform/ArchitectureFlow';
import ModulesGrid from '../components/platform/ModulesGrid';
import TechnologyStack from '../components/platform/TechnologyStack';
import BenefitsSection from '../components/platform/BenefitsSection';
import PlatformFooter from '../components/platform/PlatformFooter';

export const PlatformOverview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Platform Header */}
      <header className="sticky top-0 z-50 h-16 bg-[var(--bg-primary)] backdrop-blur-md border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
              <span className="font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                 VibeGuard AI <span className="hidden sm:inline text-[var(--text-muted)] font-normal">| Platform Overview</span>
              </span>
          </div>
          <button 
             onClick={() => navigate('/dashboard')}
             className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
              Skip Introduction →
          </button>
      </header>

      {/* Main SCROLLABLE Viewport */}
      <main className="flex-1 w-full overflow-x-hidden">
        <HeroSection />
        <ProblemStatement />
        <ArchitectureFlow />
        <ModulesGrid />
        <TechnologyStack />
        <BenefitsSection />
      </main>

      <PlatformFooter />
    </div>
  );
};

export default PlatformOverview;
