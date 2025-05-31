import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PlaneTakeoffIcon, Loader2 } from 'lucide-react';
import { loadDefaultRoutes } from './services/api';

// Import page components
import HomePage from './pages/HomePage';
import SearchFlightsPage from './pages/SearchFlightsPage';
import PriceTrendsPage from './pages/PriceTrendsPage';
import AvailableFlightsPage from './pages/AvailableFlightsPage';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load default routes when the component mounts
  useEffect(() => {
    const loadApp = async () => {
      try {
        console.log('App: Loading default routes...');
        await loadDefaultRoutes();
        
        console.log('App: Routes loaded successfully');
        setError(null);
      } catch (err) {
        console.error('App: Error loading routes:', err);
        setError('Failed to load routes. Please refresh the page to try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading application...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading application</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <PlaneTakeoffIcon className="h-8 w-8 text-blue-600" />
                <h1 className="ml-3 text-xl font-bold text-gray-900">Flight Route Manager</h1>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-500 hover:text-gray-700 font-medium">Home</Link>
                <Link to="/search" className="text-gray-500 hover:text-gray-700 font-medium">Search Flights</Link>
                <Link to="/trends" className="text-gray-500 hover:text-gray-700 font-medium">Price Trends</Link>
                <Link to="/flights" className="text-gray-500 hover:text-gray-700 font-medium">Available Flights</Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <HomePage />
              </div>
            } />
            <Route path="/search" element={
              <SearchFlightsPage />
            } />
            <Route path="/trends" element={
              <PriceTrendsPage />
            } />
            <Route path="/flights" element={
              <AvailableFlightsPage />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}