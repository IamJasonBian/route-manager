import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bitcoin, LineChart, Waves, Loader2 } from 'lucide-react';

import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import TrendsPage from './pages/TrendsPage';

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading dashboard...</p>
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
              <Bitcoin className="h-8 w-8 text-orange-500" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Bitcoin Pulse</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700 font-medium">Overview</Link>
              <Link to="/market" className="text-gray-500 hover:text-gray-700 font-medium">Live Market</Link>
              <Link to="/trends" className="text-gray-500 hover:text-gray-700 font-medium">Trends</Link>
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
          <Route path="/market" element={<MarketPage />} />
          <Route path="/trends" element={<TrendsPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-500">
            Powered by public market data. Add a token in <span className="font-medium">VITE_BITCOIN_DATA_TOKEN</span> for premium feeds.
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Streaming-ready architecture
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Historical insights
            </div>
          </div>
        </div>
      </footer>
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
