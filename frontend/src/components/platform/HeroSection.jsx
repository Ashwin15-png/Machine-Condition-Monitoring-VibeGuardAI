import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
      {/* Dynamic Background Glow Orbs for Section */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--info)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 space-y-6 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--info)]/10 border border-[var(--info)]/20 text-[var(--info)] text-xs font-semibold tracking-wide uppercase shadow-lg shadow-blue-500/5">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Industry 4.0 Real-Time Industrial IoT Monitoring Platform
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Machine Condition Monitoring <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            for a Small Production Unit
          </span>
        </h1>
        
        <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          This platform continuously monitors industrial machine health using real-time telemetry, predictive analytics, anomaly detection, and intelligent maintenance planning. It enables operators and supervisors to identify developing faults early, reduce unplanned downtime, improve equipment reliability, and support data-driven maintenance decisions through a centralized monitoring system.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button
            variant="primary"
            size="lg"
            icon={LayoutDashboard}
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8"
          >
            Continue to Dashboard
          </Button>
          <a href="#features" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 transition-all duration-200">
            View Platform Features
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
