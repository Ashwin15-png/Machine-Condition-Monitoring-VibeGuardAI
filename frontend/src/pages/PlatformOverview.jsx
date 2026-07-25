import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import HeroSection from '../components/platform/HeroSection';
import ProblemStatement from '../components/platform/ProblemStatement';
import ArchitectureFlow from '../components/platform/ArchitectureFlow';
import ModulesGrid from '../components/platform/ModulesGrid';
import TechnologyStack from '../components/platform/TechnologyStack';
import BenefitsSection from '../components/platform/BenefitsSection';
import PlatformFooter from '../components/platform/PlatformFooter';
import { Zap } from 'lucide-react';

export const PlatformOverview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-6 bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {/* Overview Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--info)]" />
            <span>Platform Overview & Architecture</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Industry 4.0 Real-Time Industrial IoT Monitoring Architecture & Technical Blueprint.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--info)]/10 border border-[var(--info)]/30 text-xs font-semibold text-[var(--info)] hover:bg-[var(--info)]/20 transition-all cursor-text shadow-sm"
        >
          <span>Launch Fleet Dashboard</span> →
        </button>
      </div>

      {/* Main Overview Content */}
      <main className="w-full overflow-x-hidden space-y-12">
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
