import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RK Nutrition UI Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5F4F2] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-[#262626] p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E11D2E]" />
            
            <div className="w-14 h-14 mx-auto bg-[#E11D2E]/10 border border-[#E11D2E]/30 flex items-center justify-center text-[#E11D2E]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F5F4F2]">
                Session State Refreshed
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#8C8C8C]">
                An unexpected interface state occurred. Your session has been safely preserved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#E11D2E] hover:bg-[#C81A27] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
