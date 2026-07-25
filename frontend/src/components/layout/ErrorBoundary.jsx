import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-full bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30 mb-4 shadow-xl">
            <AlertOctagon className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Application Error Encountered</h1>
          <p className="text-sm text-[var(--text-muted)] max-w-md mt-2 mb-6">
            An unexpected error occurred while processing sensor feeds or rendering the UI dashboard.
          </p>
          <div className="text-left bg-gray-900 text-red-400 p-4 rounded overflow-auto max-w-3xl mb-4 w-full text-xs font-mono">
            <strong>{this.state.error && this.state.error.toString()}</strong>
            <pre className="mt-2 whitespace-pre-wrap">{this.state.error && this.state.error.stack}</pre>
          </div>
          <Button variant="primary" icon={RefreshCw} onClick={this.handleReload}>
            Reload Application
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
