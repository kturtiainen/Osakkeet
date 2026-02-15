import { Component, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by ErrorBoundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-red-500/30 max-w-md w-full p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold mb-4 text-red-400">Jotain meni pieleen</h1>
              <p className="text-gray-300 mb-6">
                Sovelluksessa tapahtui virhe. Yritä päivittää sivu.
              </p>
              {this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-800 rounded-lg">
                  <summary className="cursor-pointer text-gray-400 mb-2">
                    Tekninen tieto
                  </summary>
                  <pre className="text-xs text-red-400 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-semibold
                           hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                🔄 Päivitä sivu
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
