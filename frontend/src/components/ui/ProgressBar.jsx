import React from 'react';
import { clsx } from 'clsx';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color = 'bg-blue-600',
  className = '',
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-semibold">
          {label && <span className="text-slate-400 uppercase tracking-wider">{label}</span>}
          {showValue && <span className="text-slate-200">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/40">
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
