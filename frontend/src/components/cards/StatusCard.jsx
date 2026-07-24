import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { Thermometer, Activity, Gauge, MapPin } from 'lucide-react';
import { formatTemperature, formatVibration } from '../../utils/formatters';

export const StatusCard = ({ machine, onViewDetails }) => {
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
      className="rounded-2xl bg-[#111827]/90 border border-slate-800 p-5 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all duration-300 space-y-4 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase">
            {id}
          </span>
          <h4 className="text-base font-bold text-slate-100 truncate mt-0.5">{name}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{location}</span>
          </p>
        </div>
        <Badge status={status} dot />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px]">Temp</span>
          </div>
          <p className="font-mono font-bold text-slate-200">{formatTemperature(temperature)}</p>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px]">Vib RMS</span>
          </div>
          <p className="font-mono font-bold text-slate-200">{formatVibration(vibration)}</p>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 mb-1">
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px]">RPM</span>
          </div>
          <p className="font-mono font-bold text-slate-200">{rpm.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Health Index:</span>
          <span
            className={`font-mono font-bold text-xs ${
              healthScore >= 90
                ? 'text-emerald-400'
                : healthScore >= 70
                ? 'text-amber-400'
                : 'text-red-400'
            }`}
          >
            {healthScore}%
          </span>
        </div>
        <button
          onClick={() => onViewDetails && onViewDetails(machine)}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          Telemetry Details →
        </button>
      </div>
    </motion.div>
  );
};

export default StatusCard;
