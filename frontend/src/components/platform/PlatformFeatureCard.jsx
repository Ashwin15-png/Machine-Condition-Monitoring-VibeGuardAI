import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const PlatformFeatureCard = ({
  title,
  icon: Icon,
  color = 'blue',
  delay = 0
}) => {
  const colorStyles = {
    blue: 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20',
    emerald: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    amber: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    purple: 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
      className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 backdrop-blur-xl hover:bg-slate-800 transition-all hover:border-slate-700 hover:shadow-xl hover:-translate-y-1 text-center"
    >
      <div className={clsx(
        'w-12 h-12 flex items-center justify-center rounded-xl border mb-3 transition-colors',
        colorStyles[color]
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">
        {title}
      </span>
    </motion.div>
  );
};

export default PlatformFeatureCard;
