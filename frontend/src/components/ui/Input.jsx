import React from 'react';
import { clsx } from 'clsx';

export const Input = ({
  label,
  icon: Icon,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={clsx(
            'w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm py-2.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--info)]/40 focus:border-[var(--info)]/80 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed',
            Icon ? 'pl-10' : 'pl-3.5',
            error ? 'border-[var(--danger)]/80 focus:ring-[var(--danger)]/40' : 'hover:border-[var(--text-muted)]',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-[var(--danger)] mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
