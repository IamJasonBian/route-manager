import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2, MenuIcon, XIcon } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

import HomePage from './pages/HomePage';
import SearchFlightsPage from './pages/SearchFlightsPage';
import PriceTrendsPage from './pages/PriceTrendsPage';
import ProposalsPage from './pages/ProposalsPage';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`text-base transition-colors ${
        isActive
          ? 'text-[var(--foreground)] font-semibold'
          : 'text-[var(--muted)] hover:text-[var(--foreground)]'
      }`}
    >
      {children}
    </Link>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[var(--accent)] animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-[var(--foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-md">
        <div className="max-w-[90rem] mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group hover:opacity-100">
              <span
                aria-hidden
                className="h-7 w-7 rounded-md flex items-center justify-center text-[13px] font-bold text-white
                           bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)]
                           shadow-[var(--shadow-xs)]"
              >
                ✈
              </span>
              <span className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                Simple Trip Proposals
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-5">
                <NavLink to="/proposals">Proposals</NavLink>
                <NavLink to="/search">Search</NavLink>
                <NavLink to="/trends">Trends</NavLink>
              </nav>
              <ThemeToggle />
              <button
                className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--foreground)]"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <nav className="md:hidden flex flex-col gap-3 pt-4 pb-2 border-t border-[var(--border)] mt-4">
              <NavLink to="/proposals">Proposals</NavLink>
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/trends">Trends</NavLink>
            </nav>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <div className="max-w-[90rem] mx-auto px-6 py-8">
              <HomePage />
            </div>
          } />
          <Route path="/search" element={<SearchFlightsPage />} />
          <Route path="/trends" element={<PriceTrendsPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-[var(--border)] mt-16 py-6 text-center text-sm text-[var(--muted)]">
        Simple Trip Proposals
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
