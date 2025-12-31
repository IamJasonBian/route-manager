import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react';
import { getHistoricPrices, getSpotPrice, type HistoricPricePoint, type SpotPrice } from '../services/bitcoinApi';

interface MarketSnapshot {
  high: number;
  low: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export default function MarketPage() {
  const [spotPrice, setSpotPrice] = useState<SpotPrice | null>(null);
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [history, setHistory] = useState<HistoricPricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedSpot = useMemo(() => {
    if (!spotPrice) return '--';
    return Number(spotPrice.amount).toLocaleString('en-US', {
      style: 'currency',
      currency: spotPrice.currency,
      maximumFractionDigits: 2
    });
  }, [spotPrice]);

  const recentTicks = useMemo(() => {
    if (history.length === 0) return [];
    return history.slice(-6).reverse();
  }, [history]);

  const loadMarketData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [spot, dailyHistory] = await Promise.all([
        getSpotPrice('USD'),
        getHistoricPrices('day')
      ]);

      setSpotPrice(spot);
      setHistory(dailyHistory);

      if (dailyHistory.length > 1) {
        const sorted = [...dailyHistory].sort(
          (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
        );
        const low = Math.min(...sorted.map(point => point.price));
        const high = Math.max(...sorted.map(point => point.price));
        const first = sorted[0].price;
        const last = sorted[sorted.length - 1].price;
        const change = last - first;
        const changePercent = first === 0 ? 0 : (change / first) * 100;

        setSnapshot({
          high,
          low,
          change,
          changePercent,
          lastUpdated: sorted[sorted.length - 1].recorded_at
        });
      }
    } catch (loadError) {
      console.error(loadError);
      setError('Unable to load Bitcoin market data. Try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMarketData();
  }, []);

  const changeIcon = snapshot && snapshot.change >= 0 ? (
    <ArrowUp className="h-5 w-5 text-emerald-500" />
  ) : (
    <ArrowDown className="h-5 w-5 text-rose-500" />
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Live Market</h2>
            <p className="text-gray-600 mt-1">Spot Bitcoin pricing and intraday movement.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadMarketData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/trends"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-white"
            >
              View Trends
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Spot Price" value={formattedSpot} isLoading={isLoading} />
          <StatCard
            label="24h Change"
            value={snapshot ? `${snapshot.change >= 0 ? '+' : ''}${snapshot.change.toFixed(2)} USD` : '--'}
            isLoading={isLoading}
            helper={snapshot ? `${snapshot.changePercent >= 0 ? '+' : ''}${snapshot.changePercent.toFixed(2)}%` : undefined}
            accent={snapshot && snapshot.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}
            icon={changeIcon}
          />
          <StatCard
            label="24h Range"
            value={snapshot ? `$${snapshot.low.toFixed(2)} → $${snapshot.high.toFixed(2)}` : '--'}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest ticks</h3>
            <div className="space-y-3">
              {recentTicks.map((point) => (
                <div key={point.recorded_at} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(point.recorded_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${point.price.toFixed(2)}
                  </span>
                </div>
              ))}
              {history.length === 0 && !isLoading && (
                <p className="text-sm text-gray-500">No intraday data available.</p>
              )}
              {isLoading && (
                <p className="text-sm text-gray-500">Loading intraday data…</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data feed</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                This view pulls directly from a public market endpoint using <span className="font-medium">fetch</span> on the client.
              </p>
              <p>
                To use a premium provider, set <span className="font-medium">VITE_BITCOIN_DATA_TOKEN</span> in your environment and restart the dev server.
              </p>
              {snapshot?.lastUpdated && (
                <p className="text-gray-500">
                  Last update: {new Date(snapshot.lastUpdated).toLocaleString('en-US')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  isLoading,
  accent = 'text-gray-900',
  icon
}: {
  label: string;
  value: string;
  helper?: string;
  isLoading: boolean;
  accent?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {icon}
        <p className={`text-2xl font-semibold ${accent}`}>{isLoading ? 'Loading…' : value}</p>
      </div>
      {helper && <p className="text-sm text-gray-500 mt-2">{helper}</p>}
    </div>
  );
}
