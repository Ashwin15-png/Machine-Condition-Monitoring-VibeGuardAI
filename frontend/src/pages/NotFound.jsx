import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-full bg-[var(--info)]/10 text-[var(--info)] border border-[var(--info)]/30 mb-4 shadow-xl">
        <AlertOctagon className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-[var(--text-primary)] font-mono">404</h1>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">Telemetry Route Not Found</h2>
      <p className="text-xs text-[var(--text-muted)] max-w-md mt-2 mb-6">
        The requested industrial monitoring path does not exist or has been decommissioned from the system route table.
      </p>
      <Button variant="primary" icon={Home} onClick={() => navigate('/overview')}>
        Return to Overview
      </Button>
    </div>
  );
};

export default NotFound;
