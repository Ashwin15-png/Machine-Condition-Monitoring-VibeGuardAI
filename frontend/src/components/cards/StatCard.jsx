import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  subtitle,
  onClick,
}) => {
  const colorMap = {
    blue: {
      border: 'hover:border-[var(--info)]/50',
      glow: 'from-blue-500/10 to-transparent',
      iconBg: 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/30',
    },
    emerald: {
      border: 'hover:border-[var(--success)]/50',
      glow: 'from-emerald-500/10 to-transparent',
      iconBg: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30',
    },
    amber: {
      border: 'hover:border-[var(--warning)]/50',
      glow: 'from-amber-500/10 to-transparent',
      iconBg: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30',
    },
    red: {
      border: 'hover:border-[var(--danger)]/50',
      glow: 'from-red-500/10 to-transparent',
      iconBg: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30',
    },
    purple: {
      border: 'hover:border-[var(--info)]/50',
      glow: 'from-purple-500/10 to-transparent',
      iconBg: 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/30',
    },
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 backdrop-blur-md shadow-sm transition-all duration-300 overflow-hidden cursor-pointer group card',
        selectedColor.border
      )}
    >
      {/* Top Gradient Background Accent */}
      <div
        className={clsx(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
          selectedColor.glow
        )}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider truncate">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight font-mono">
              {value}
            </span>
            {unit && <span className="text-xs text-[var(--text-muted)] font-medium">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div
            className={clsx(
              'p-3 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg',
              selectedColor.iconBg
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Footer Trend & Subtitle */}
      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 font-semibold',
                trend === 'up'
                  ? 'text-[var(--success)]'
                  : trend === 'down'
                  ? 'text-[var(--danger)]'
                  : 'text-[var(--text-muted)]'
              )}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
          {subtitle && <span className="text-[var(--text-muted)] font-medium truncate ml-auto">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
