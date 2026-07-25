import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-[var(--info)] hover:bg-[#0097B2] text-white shadow-sm transition-colors border-transparent',
  secondary: 'bg-[var(--bg-primary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm transition-colors',
  success: 'bg-[var(--success)] hover:opacity-90 text-white shadow-sm transition-colors border-transparent',
  danger: 'bg-[var(--danger)] hover:opacity-90 text-white shadow-sm transition-colors border-transparent',
  outline: 'bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors',
  ghost: 'bg-transparent hover:bg-[var(--info)]/10 text-[var(--info)] transition-colors',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'h-[54px] px-6 text-[15px] font-semibold rounded-[14px] gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--info)]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current fill-none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
