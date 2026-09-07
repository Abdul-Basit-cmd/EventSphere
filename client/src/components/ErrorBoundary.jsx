import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-xl border m-4"
        >
          <div
            style={{
              backgroundColor: 'var(--color-danger-muted)',
              borderColor: 'var(--color-danger)',
              color: 'var(--color-danger)',
            }}
            className="w-12 h-12 rounded-full border flex items-center justify-center mb-4"
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold mb-1">Something went wrong</h3>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs max-w-md mb-5 leading-relaxed">
            An unexpected error occurred while displaying this page. Details: {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg btn-primary"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Page</span>
            </button>
            <a
              href="/"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              className="px-4 py-2 text-xs font-medium rounded-lg border hover:bg-[var(--color-border)] transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
