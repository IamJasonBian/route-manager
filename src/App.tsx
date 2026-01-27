import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bitcoin, LayoutDashboard, GitCompare, TrendingUp } from 'lucide-react';

// Import page components
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import TradePage from './pages/TradePage';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`font-medium transition-colors ${
        isActive
          ? 'text-orange-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <Bitcoin className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">Bitcoin Tracker</h1>
            </Link>
            <nav className="flex items-center space-x-8">
              <NavLink to="/">
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </span>
              </NavLink>
              <NavLink to="/compare">
                <span className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  Compare
                </span>
              </NavLink>
              <NavLink to="/trade">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trade
                </span>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/trade" element={<TradePage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Data provided by{' '}
            <a
              href="https://twelvedata.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Twelve Data
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
