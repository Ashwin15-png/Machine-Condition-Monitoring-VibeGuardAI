import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { Thermometer, Activity, Gauge, MapPin, Edit2 } from 'lucide-react';
import { formatTemperature, formatVibration } from '../../utils/formatters';

export const StatusCard = ({ machine, onViewDetails, onEdit }) => {
  const {
    id,
    name,
    location,
    type,
    status,
    temperature,
    vibration,
    rpm,
    healthScore,
  } = machine;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="card rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 backdrop-blur-md shadow-sm hover:border-[var(--info)] transition-all duration-300 space-y-4 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] tracking-wider uppercase">
            {id}
          </span>
          <h4 className="text-base font-bold text-[var(--text-primary)] truncate mt-0.5">{name}</h4>
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
            <span>{location}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge status={status} dot />
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(machine);
              }}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--warning)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
              title="Edit Machine Configuration"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-xs">
        <div className="bg-[var(--bg-secondary)] p-2.5 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-1 text-[var(--text-secondary)] mb-1">
            <Thermometer className="w-3.5 h-3.5 text-[var(--warning)]" />
            <span className="text-[10px]">Temp</span>
          </div>
          <p className="font-mono font-bold text-[var(--text-primary)]">{formatTemperature(temperature)}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] p-2.5 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-1 text-[var(--text-secondary)] mb-1">
            <Activity className="w-3.5 h-3.5 text-[var(--info)]" />
            <span className="text-[10px]">Vib RMS</span>
          </div>
          <p className="font-mono font-bold text-[var(--text-primary)]">{formatVibration(vibration)}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] p-2.5 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-1 text-[var(--text-secondary)] mb-1">
            <Gauge className="w-3.5 h-3.5 text-[var(--info)]" />
            <span className="text-[10px]">RPM</span>
          </div>
          <p className="font-mono font-bold text-[var(--text-primary)]">{rpm.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] font-medium">Health Index:</span>
          <span
            className={`font-mono font-bold text-xs ${
              healthScore >= 90
                ? 'text-[var(--success)]'
                : healthScore >= 70
                ? 'text-[var(--warning)]'
                : 'text-[var(--danger)]'
            }`}
          >
            {healthScore}%
          </span>
        </div>
        <button
          onClick={() => onViewDetails && onViewDetails(machine)}
          className="text-xs font-semibold text-[var(--info)] hover:opacity-80 hover:underline transition-colors"
        >
          Telemetry Details →
        </button>
      </div>
    </motion.div>
  );
};

export default StatusCard;
