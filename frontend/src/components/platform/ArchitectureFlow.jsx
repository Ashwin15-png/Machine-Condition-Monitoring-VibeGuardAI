import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Database, Server, BarChart3, Bell, Grid, ActivitySquare } from 'lucide-react';

export const ArchitectureFlow = () => {
  const nodes = [
    { label: 'Industrial Sensors', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    { label: 'Telemetry Collection', icon: ActivitySquare, color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10', border: 'border-[var(--success)]/30' },
    { label: 'Backend Processing', icon: Server, color: 'text-[var(--info)]', bg: 'bg-[var(--info)]/10', border: 'border-[var(--info)]/30' },
    { label: 'MongoDB Storage', icon: Database, color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10', border: 'border-[var(--success)]/30' },
    { label: 'Analytics', icon: BarChart3, color: 'text-[var(--info)]', bg: 'bg-[var(--info)]/10', border: 'border-[var(--info)]/30' },
    { label: 'Socket.IO', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { label: 'Real-time Dashboard', icon: Grid, color: 'text-[var(--info)]', bg: 'bg-[var(--info)]/10', border: 'border-[var(--info)]/30' },
    { label: 'Alerts', icon: Bell, color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/10', border: 'border-[var(--warning)]/30' },
    { label: 'Maintenance Planning', icon: Cpu, color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10', border: 'border-[var(--success)]/30' },
  ];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Platform Overview & Architecture</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
          Secure, isolated data flow architecture built explicitly for robust industrial telemetry processing and storage.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 relative z-10 p-5">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border backdrop-blur-md shadow-xl w-36 h-32 ${node.bg} ${node.border}`}
              >
                <Icon className={`w-8 h-8 mb-3 ${node.color}`} />
                <span className="text-[11px] font-bold text-slate-200 text-center uppercase tracking-wider">{node.label}</span>
              </motion.div>
              {index < nodes.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-6">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="h-[2px] bg-slate-700 w-full"
                  />
                  <div className="w-2 h-2 rounded-full bg-slate-500 ml-[-4px]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};

export default ArchitectureFlow;
