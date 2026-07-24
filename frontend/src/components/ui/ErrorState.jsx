import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'System Error Detected',
  message = 'Failed to communicate with sensor data telemetry service or backend API.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-red-950/20 border border-red-900/30 my-4">
      <div className="p-3.5 rounded-full bg-red-500/10 text-red-400 mb-3 border border-red-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-red-200">{title}</h4>
      <p className="text-xs text-red-300/80 max-w-md mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
