import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PlaneTakeoffIcon, Loader2 } from 'lucide-react';

// Import page components
import HomePage from './pages/HomePage';
import SearchFlightsPage from './pages/SearchFlightsPage';
import PriceTrendsPage from './pages/PriceTrendsPage';
import RouteSummaryPage from './pages/RouteSummaryPage';
import MarketDataPage from './pages/MarketDataPage';

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);

  // For now, we'll skip the initial loading since we're using mock data
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
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
              <Link to="/market-data" className="text-gray-500 hover:text-gray-700 font-medium">Market Data</Link>
              <Link to="/route-summary" className="text-gray-500 hover:text-gray-700 font-medium">Route Summary</Link>
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
          <Route path="/search" element={<SearchFlightsPage />} />
          <Route path="/trends" element={<PriceTrendsPage />} />
          <Route path="/market-data" element={<MarketDataPage />} />
          <Route path="/route-summary" element={<RouteSummaryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}