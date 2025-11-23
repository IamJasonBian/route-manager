import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketDataChart, { type MarketSeries } from '../components/MarketDataChart';
import { fetchMarketSeries, type MarketSeriesConfig } from '../services/marketDataService';

const SERIES_CONFIG: MarketSeriesConfig[] = [
  {
    label: 'Bitcoin (BTC/USD)',
    symbol: 'BTCUSD',
    dataset: 'CRYPTO.BTCUSD',
    color: '#f59e0b',
  },
  {
    label: 'S&P 500 (SPY)',
    symbol: 'SPY',
    dataset: 'XNAS.ITCH',
    color: '#2563eb',
  },
  {
    label: 'Nasdaq 100 (QQQ)',
    symbol: 'QQQ',
    dataset: 'XNAS.ITCH',
    color: '#10b981',
  },
  {
    label: 'Amazon (AMZN)',
    symbol: 'AMZN',
    dataset: 'XNAS.ITCH',
    color: '#ef4444',
  },
];

const MarketDataPage = () => {
  const [series, setSeries] = useState<MarketSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const orderedSeries = useMemo(() =>
    series.map(entry => ({
      ...entry,
      prices: [...entry.prices].sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()),
    })),
  [series]);

  useEffect(() => {
    let mounted = true;

    const loadSeries = async () => {
      try {
        setLoading(true);
        const start = new Date();
        start.setMonth(start.getMonth() - 2);
        const startDate = start.toISOString().split('T')[0];

        const results = await Promise.all(
          SERIES_CONFIG.map(async config => ({
            label: config.label,
            color: config.color,
            prices: await fetchMarketSeries(config, startDate),
          })),
        );

        if (!mounted) return;
        setSeries(results);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error('Failed to load market data', err);
        if (!mounted) return;
        setError('Unable to stream DataBento time-series data right now. Using the synthetic fallback curves.');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadSeries();
    const intervalId = setInterval(loadSeries, 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
              <span className="text-xs text-gray-500">DataBento EOD stream</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Market time-series dashboard</h1>
            <p className="text-sm text-gray-600">
              Live pull of end-of-day closes for Bitcoin, SPY, QQQ, and AMZN using the provided DataBento credentials.
              If the stream is unreachable, synthetic curves keep the visualization responsive.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Refreshes every minute</div>
            {lastUpdated && <div className="text-sm font-medium text-gray-700">Updated at {lastUpdated}</div>}
          </div>
        </div>

        <MarketDataChart series={orderedSeries} loading={loading} error={error} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERIES_CONFIG.map(asset => (
            <div key={asset.symbol} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{asset.label}</h2>
                  <p className="text-xs text-gray-500">Dataset: {asset.dataset} • Symbol: {asset.symbol}</p>
                </div>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${asset.color}1a`, color: asset.color }}
                >
                  Tracking
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Requests are sent directly to the DataBento historical endpoint using the supplied API keys.
                The client keeps polling so the chart can update as fresh EOD bars arrive.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDataPage;
