import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemStatement = () => {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/60 border border-[var(--danger)]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--danger)]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 flex items-center justify-center text-[var(--danger)] shadow-xl shadow-red-500/10">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-slate-100">The Core Operational Challenge</h2>
            <div className="space-y-3 text-sm md:text-base text-slate-300">
              <p>
                Small production units typically depend on one or two critical machines. Unexpected failures on these primary assets instantly stop the entire production line.
              </p>
              <p>
                Because these organizations traditionally rely on reactive maintenance protocols, unplanned downtime severely impacts throughput. Hidden micro-anomalies—specifically rising vibration envelopes and thermal spikes—often precede catastrophic failures by weeks.
              </p>
              <p className="font-semibold text-[var(--info)]">
                This platform continuously monitors machine health in real-time, enabling early detection and facilitating planned maintenance before fatal breakdowns ever occur!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProblemStatement;
