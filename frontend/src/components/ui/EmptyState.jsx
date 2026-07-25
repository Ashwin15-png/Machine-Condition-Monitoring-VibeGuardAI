import React from 'react';
import { Database } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Database,
  title = 'No Data Available',
  description = 'No industrial records or telemetry logs were found for the selected criteria.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[var(--bg-card)] border border-dashed border-[var(--border)] my-4">
      <div className="p-4 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] mb-4 shadow-inner border border-[var(--border)]">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-[var(--text-primary)]">{title}</h4>
      <p className="text-xs text-[var(--text-muted)] max-w-md mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
