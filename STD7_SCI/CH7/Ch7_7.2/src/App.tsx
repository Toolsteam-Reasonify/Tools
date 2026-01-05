import React, { useState, ErrorInfo, ReactNode } from 'react';
import { LanguageProvider } from './components/ConvectionLearning';
import ConvectionLearning from './components/ConvectionLearning';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  const [mode, setMode] = useState<'learn' | 'practice' | 'applications'>('learn');

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
          <ConvectionLearning mode={mode} setMode={setMode} />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
