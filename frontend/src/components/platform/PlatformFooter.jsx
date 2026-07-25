import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const PlatformFooter = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--info)]/20 border border-[var(--info)]/30 flex items-center justify-center text-[var(--info)]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100">Machine Condition Monitoring for a Small Production Unit</h4>
            <p className="text-xs text-slate-500">Industry 4.0 Industrial IoT Platform</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Powered By</span>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">React</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">Node.js</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">MongoDB Atlas</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">Socket.IO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlatformFooter;
