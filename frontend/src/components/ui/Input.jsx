import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  icon: Icon,
  rightIcon: RightIcon,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  showPasswordToggle = type === 'password',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] mb-[10px] select-none"
        >
          {label}
        </label>
      )}
      <div className="relative w-full flex items-center">
        {Icon && (
          <div className="absolute left-[20px] top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)] flex items-center justify-center z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          id={inputId}
          type={effectiveType}
          className={clsx(
            'w-full h-[56px] rounded-[14px] bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[15px] font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--info)]/40 focus:border-[var(--info)] disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed',
            'placeholder:text-[var(--text-muted)] placeholder:text-[15px]',
            Icon ? 'pl-[56px]' : 'pl-[20px]',
            isPassword || RightIcon ? 'pr-[52px]' : 'pr-[20px]',
            error ? 'border-[var(--danger)] focus:ring-[var(--danger)]/40' : 'hover:border-[var(--text-muted)]',
            className
          )}
          {...props}
        />

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-[20px] top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none cursor-pointer flex items-center justify-center z-10"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        ) : RightIcon ? (
          <div className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none flex items-center justify-center z-10">
            <RightIcon className="w-5 h-5" />
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-[var(--danger)] mt-1.5 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--text-muted)] mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
