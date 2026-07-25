import React from 'react';
import { clsx } from 'clsx';

export const Loader = ({ size = 'md', label, className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center p-4 space-y-3', className)}>
      <div
        className={clsx(
          'rounded-full border-[var(--border)] border-t-blue-500 animate-spin',
          sizes[size]
        )}
      />
      {label && <p className="text-xs text-[var(--text-muted)] font-medium tracking-wide animate-pulse">{label}</p>}
    </div>
  );
};

export default Loader;
