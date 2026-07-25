export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatTemperature = (temp, unit = '°C') => {
  if (temp === null || temp === undefined) return `0 ${unit}`;
  return `${formatNumber(temp, 1)} ${unit}`;
};

export const formatVibration = (vib, unit = 'mm/s') => {
  if (vib === null || vib === undefined) return `0 ${unit}`;
  return `${formatNumber(vib, 2)} ${unit}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'healthy':
    case 'online':
    case 'running':
      return {
        bg: 'bg-[var(--badge-normal-bg)]',
        text: 'text-[var(--badge-normal-text)]',
        border: 'border-transparent',
        dot: 'bg-[var(--badge-normal-text)]',
      };
    case 'warning':
    case 'degraded':
      return {
        bg: 'bg-[var(--badge-warning-bg)]',
        text: 'text-[var(--badge-warning-text)]',
        border: 'border-transparent',
        dot: 'bg-[var(--badge-warning-text)]',
      };
    case 'critical':
    case 'fault':
    case 'error':
      return {
        bg: 'bg-[var(--badge-critical-bg)]',
        text: 'text-[var(--badge-critical-text)]',
        border: 'border-transparent',
        dot: 'bg-[var(--badge-critical-text)]',
      };
    default:
      return {
        bg: 'bg-[var(--badge-offline-bg)]',
        text: 'text-[var(--badge-offline-text)]',
        border: 'border-[var(--border)]',
        dot: 'bg-[var(--badge-offline-text)]',
      };
  }
};
