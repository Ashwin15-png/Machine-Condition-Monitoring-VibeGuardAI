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
      border: 'hover:border-blue-500/50',
      glow: 'from-blue-500/10 to-transparent',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      glow: 'from-emerald-500/10 to-transparent',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      glow: 'from-amber-500/10 to-transparent',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    red: {
      border: 'hover:border-red-500/50',
      glow: 'from-red-500/10 to-transparent',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    purple: {
      border: 'hover:border-purple-500/50',
      glow: 'from-purple-500/10 to-transparent',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl bg-[#111827]/90 border border-slate-800/80 p-5 backdrop-blur-md shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group',
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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              {value}
            </span>
            {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
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
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 font-semibold',
                trend === 'up'
                  ? 'text-emerald-400'
                  : trend === 'down'
                  ? 'text-red-400'
                  : 'text-slate-400'
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
          {subtitle && <span className="text-slate-500 font-medium truncate ml-auto">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
