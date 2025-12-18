import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-slide-up">
            {/* Error Icon */}
            <div className="text-8xl mb-6 animate-bounce">
              🚨
            </div>
            
            {/* Error Title */}
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Oops! Something went wrong
            </h1>
            
            {/* Error Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected error while loading the application. 
              Don't worry, this happens sometimes!
            </p>
            
            {/* Error Details */}
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-700 mb-2">Error Details:</h3>
                <code className="text-sm text-red-600 break-all">
                  Something unexpected happened. Please try reloading the page.
                </code>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔄 Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🏠 Go Home
              </button>
            </div>
            
            {/* Helpful Message */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> If this keeps happening, try refreshing the page or clearing your browser cache.
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-red-200 rounded-full animate-pulse" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-pink-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-4 left-6 w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;