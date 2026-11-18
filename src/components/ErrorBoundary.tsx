import React from 'react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F8F6] flex items-center justify-center p-6">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-[#163D32]">Something went wrong</h2>
            <p className="text-sm text-[#747B75] mt-2">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 bg-[#163D32] text-white text-sm font-semibold rounded-lg"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
