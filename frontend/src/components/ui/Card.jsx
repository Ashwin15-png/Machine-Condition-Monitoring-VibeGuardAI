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
        'rounded-2xl border border-[var(--border)] p-5 transition-all duration-300 relative overflow-hidden card',
        glass ? 'bg-[var(--bg-card)] backdrop-blur-md' : 'bg-[var(--bg-primary)]',
        hoverEffect && 'hover:border-[var(--info)] hover:shadow-lg hover:shadow-[var(--info)]/10 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4', className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-base font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-2', className)}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={clsx('space-y-4', className)}>{children}</div>
);

export default Card;
