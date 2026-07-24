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
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={clsx(
            'w-full rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm py-2.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 disabled:opacity-50 disabled:cursor-not-allowed',
            Icon ? 'pl-10' : 'pl-3.5',
            error ? 'border-red-500/80 focus:ring-red-500/50' : 'hover:border-slate-700',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
