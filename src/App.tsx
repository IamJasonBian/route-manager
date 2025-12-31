import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';
import DashboardPage from './pages/DashboardPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center group">
            <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
              <Bitcoin className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">Market Tracker</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Bitcoin data:{' '}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              CoinGecko
            </a>
            {' | S&P 500 data: '}
            <a
              href="https://www.alphavantage.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Alpha Vantage
            </a>
          </p>
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
