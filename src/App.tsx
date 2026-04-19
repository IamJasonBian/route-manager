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
      className={`text-sm transition-colors ${
        isActive
          ? 'text-[var(--foreground)] font-medium'
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
        <Loader2 className="h-6 w-6 text-[var(--muted)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-[72rem] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold tracking-tight text-[var(--foreground)] hover:opacity-100">
              Simple Trip Proposals
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/proposals">Proposals</NavLink>
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/trends">Trends</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="md:hidden border-t border-[var(--border)] px-6 py-3 flex flex-col gap-2 bg-[var(--background)]">
            <NavLink to="/proposals">Proposals</NavLink>
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/trends">Trends</NavLink>
          </nav>
        )}
      </header>

      <main className="max-w-[72rem] mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchFlightsPage />} />
          <Route path="/trends" element={<PriceTrendsPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--muted)]">
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
