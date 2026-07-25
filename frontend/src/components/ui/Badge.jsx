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
      case 'info':
        styleClasses = 'bg-[var(--info)]/20 text-[var(--info)] border border-transparent';
        dotClass = 'bg-[var(--info)]';
        break;
      case 'success':
        styleClasses = 'bg-[var(--badge-normal-bg)] text-[var(--badge-normal-text)] border border-transparent';
        dotClass = 'bg-[var(--badge-normal-text)]';
        break;
      case 'warning':
        styleClasses = 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border border-transparent';
        dotClass = 'bg-[var(--badge-warning-text)]';
        break;
      case 'danger':
        styleClasses = 'bg-[var(--badge-critical-bg)] text-[var(--badge-critical-text)] border border-transparent';
        dotClass = 'bg-[var(--badge-critical-text)]';
        break;
      default:
        styleClasses = 'bg-[var(--badge-offline-bg)] text-[var(--badge-offline-text)] border border-[var(--border)]';
        dotClass = 'bg-[var(--badge-offline-text)]';
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
