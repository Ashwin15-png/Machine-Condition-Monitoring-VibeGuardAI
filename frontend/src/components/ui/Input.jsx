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
  autoComplete,
  'aria-label': ariaLabel,
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
          className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] mb-[12px] select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <Icon className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] opacity-75 pointer-events-none text-[var(--text-muted)] z-10" />
        )}

        <input
          id={inputId}
          type={effectiveType}
          autoComplete={autoComplete}
          aria-label={ariaLabel || label || props.placeholder || inputId}
          style={{
            paddingLeft: Icon ? '60px' : '20px',
            paddingRight: isPassword || RightIcon ? '55px' : '20px',
            ...props.style,
          }}
          className={clsx(
            'w-full h-[56px] rounded-[14px] bg-[#111111] border border-white/10 text-white text-[15px] font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40 focus:border-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed',
            'placeholder:text-white/45 placeholder:text-[15px] placeholder:font-normal',
            Icon ? '!pl-[60px]' : '!pl-[20px]',
            isPassword || RightIcon ? '!pr-[55px]' : '!pr-[20px]',
            error ? 'border-[var(--danger)] focus:ring-[var(--danger)]/40' : 'hover:border-white/20',
            className
          )}
          {...props}
        />

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] opacity-75 hover:opacity-100 text-white transition-opacity focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 rounded-sm cursor-pointer flex items-center justify-center z-10"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        ) : RightIcon ? (
          <div className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] opacity-75 text-white pointer-events-none flex items-center justify-center z-10">
            <RightIcon className="w-5 h-5" />
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-[var(--danger)] mt-1.5 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-white/50 mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
