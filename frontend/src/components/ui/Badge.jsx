import React from 'react';
import { clsx } from 'clsx';
import { getStatusColor } from '../../utils/formatters';

export const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  dot = false,
  className = '',
}) => {
  let styleClasses = '';
  let dotClass = '';

  if (status) {
    const s = getStatusColor(status);
    styleClasses = `${s.bg} ${s.text} ${s.border} border`;
    dotClass = s.dot;
  } else {
    switch (variant) {
      case 'primary':
        styleClasses = 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
        dotClass = 'bg-blue-400';
        break;
      case 'success':
        styleClasses = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
        dotClass = 'bg-emerald-400';
        break;
      case 'warning':
        styleClasses = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
        dotClass = 'bg-amber-400';
        break;
      case 'danger':
        styleClasses = 'bg-red-500/10 text-red-400 border border-red-500/30';
        dotClass = 'bg-red-400';
        break;
      case 'info':
        styleClasses = 'bg-sky-500/10 text-sky-400 border border-sky-500/30';
        dotClass = 'bg-sky-400';
        break;
      default:
        styleClasses = 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]';
        dotClass = 'bg-slate-400';
        break;
    }
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs rounded-md gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-lg gap-2',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium tracking-wide transition-colors duration-150',
        styleClasses,
        sizes[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotClass)} />}
      <span>{children || status}</span>
    </span>
  );
};

export default Badge;
