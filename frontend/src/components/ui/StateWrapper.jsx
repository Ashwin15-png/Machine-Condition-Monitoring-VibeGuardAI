import React from 'react';
import { Loader2, AlertCircle, WifiOff, RefreshCw, FolderSearch } from 'lucide-react';
import Button from './Button';

export const StateWrapper = ({
  loading = false,
  error = null,
  empty = false,
  offline = !navigator.onLine,
  onRetry,
  emptyMessage = "No data found matching your query.",
  emptyTitle = "No Results",
  loadingMessage = "Initializing data stream...",
  children
}) => {
  if (offline) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <WifiOff className="w-12 h-12 text-[var(--text-muted)]" />
        <div className="text-center space-y-1">
          <p className="font-semibold text-[var(--text-secondary)]">Network Offline</p>
          <p className="text-xs">Your connection to the Vanguard Telemetry link is down.</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
            Retry Connection
          </Button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-blue-400 space-y-4 bg-[var(--bg-card)] rounded-xl border border-blue-900/40">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-mono animate-pulse">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[200px] flex flex-col items-center justify-center text-red-400 space-y-4 bg-red-950/20 rounded-xl border border-red-900/50 p-6 text-center">
        <AlertCircle className="w-10 h-10" />
        <div className="space-y-1">
          <p className="font-semibold text-red-300">Telemetry Stream Error</p>
          <p className="text-xs break-all max-w-sm">{error.message || error || "An unexpected system failure occurred."}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
            Attempt Recovery
          </Button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] border-dashed">
        <FolderSearch className="w-10 h-10 text-[var(--text-muted)]" />
        <div className="text-center space-y-1">
          <p className="font-semibold text-[var(--text-secondary)]">{emptyTitle}</p>
          <p className="text-xs">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default StateWrapper;
