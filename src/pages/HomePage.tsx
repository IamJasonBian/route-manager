import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Activity, CandlestickChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bitcoin Pulse</h1>
        <p className="text-lg text-gray-600 mb-10">
          Monitor live Bitcoin pricing, track intraday momentum, and explore historical trends without relying on backend services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Highlight
            title="Live Spot"
            description="Get instant USD pricing with optional premium API tokens."
            icon={<Activity className="h-6 w-6 text-orange-500" />}
          />
          <Highlight
            title="Momentum"
            description="Gauge 24-hour movement, highs, and lows in one view."
            icon={<ArrowUpRight className="h-6 w-6 text-orange-500" />}
          />
          <Highlight
            title="Trend Lens"
            description="Explore month-to-year history with drawdown insights."
            icon={<CandlestickChart className="h-6 w-6 text-orange-500" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Live Market"
            description="Real-time spot price, intraday change, and quick stats."
            to="/market"
          />
          <Card
            title="Trends"
            description="Interactive charts for Bitcoin’s recent performance."
            to="/trends"
          />
        </div>
      </div>
    </div>
  );
}

function Highlight({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm text-left">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-orange-50">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Card({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow text-left"
    >
      <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
