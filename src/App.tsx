import { useEffect, useState } from 'react';  // Required for JSX
import { PlaneTakeoffIcon, Loader2 } from 'lucide-react';
import { RouteList } from './components/RouteList';
import { FlightSearch } from './components/FlightSearch';
import { loadDefaultRoutes } from './services/api';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load default routes when the component mounts
  useEffect(() => {
    const loadApp = async () => {
      try {
        console.log('App: Loading default routes...');
        await loadDefaultRoutes();
        console.log('App: Default routes loaded successfully');
      } catch (err) {
        console.error('App: Error loading default routes:', err);
        setError('Failed to load routes. Please refresh the page to try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading routes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-md w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <PlaneTakeoffIcon className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Flight Search & Route Manager</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Flights</h2>
          <FlightSearch />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Saved Routes</h2>
          <RouteList />
        </div>
      </main>
    </div>
  );
}