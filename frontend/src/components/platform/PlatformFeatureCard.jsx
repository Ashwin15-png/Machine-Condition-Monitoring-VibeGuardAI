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
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
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
