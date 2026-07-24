import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={clsx(
        'rounded-2xl border border-slate-800/80 p-5 shadow-xl transition-all duration-300 relative overflow-hidden',
        glass ? 'bg-[#111827]/90 backdrop-blur-md' : 'bg-[#0F172A]',
        hoverEffect && 'hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4', className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2', className)}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={clsx('space-y-4', className)}>{children}</div>
);

export default Card;
