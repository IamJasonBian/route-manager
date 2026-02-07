import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Plus,
  X,
  Bitcoin,
} from 'lucide-react';
import {
  getGrayscaleProjection,
  GrayscaleProjection,
} from '../services/twelveDataService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface StopLoss {
  id: string;
  price: number;
  label: string;
  triggered: boolean;
}

const STORAGE_KEY = 'grayscale-btc-stop-losses';

function loadStopLosses(): StopLoss[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveStopLosses(stops: StopLoss[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
}

export default function GrayscaleBtcProjection() {
  const [projection, setProjection] = useState<GrayscaleProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stopLosses, setStopLosses] = useState<StopLoss[]>(loadStopLosses);
  const [newStopPrice, setNewStopPrice] = useState('');
  const [newStopLabel, setNewStopLabel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProjection = useCallback(async () => {
    try {
      const data = await getGrayscaleProjection();
      setProjection(data);
      setError(null);

      // Check stop losses against projected price
      setStopLosses((prev) => {
        const updated = prev.map((sl) => ({
          ...sl,
          triggered: data.projectedEtfPrice <= sl.price,
        }));
        saveStopLosses(updated);
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projection');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjection();
    const interval = setInterval(fetchProjection, 60000);
    return () => clearInterval(interval);
  }, [fetchProjection]);

  const addStopLoss = () => {
    const price = parseFloat(newStopPrice);
    if (isNaN(price) || price <= 0) return;

    const newStop: StopLoss = {
      id: Date.now().toString(),
      price,
      label: newStopLabel || `Stop @ ${formatCurrency(price)}`,
      triggered: projection ? projection.projectedEtfPrice <= price : false,
    };

    const updated = [...stopLosses, newStop].sort((a, b) => b.price - a.price);
    setStopLosses(updated);
    saveStopLosses(updated);
    setNewStopPrice('');
    setNewStopLabel('');
    setShowAddForm(false);
  };

  const removeStopLoss = (id: string) => {
    const updated = stopLosses.filter((sl) => sl.id !== id);
    setStopLosses(updated);
    saveStopLosses(updated);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Failed to load Grayscale BTC projection</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    );
  }

  if (!projection) return null;

  const isPositive = projection.projectedChangePercent >= 0;
  const triggeredStops = stopLosses.filter((sl) => sl.triggered);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bitcoin className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Grayscale Bitcoin Mini Trust ETF (BTC)
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  projection.marketOpen
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <Clock className="w-3 h-3" />
                  {projection.marketOpen ? 'Market Open' : 'Market Closed'}
                </span>
                {!projection.marketOpen && (
                  <span className="text-xs text-gray-400">
                    Projection based on live BTC
                  </span>
                )}
              </div>
            </div>
          </div>
          {triggeredStops.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                {triggeredStops.length} stop{triggeredStops.length > 1 ? 's' : ''} triggered
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
        <div className="bg-white p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Close</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(projection.etfLastClose)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {projection.etfDatetime}
          </p>
        </div>

        <div className="bg-white p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Projected Price
          </p>
          <p className={`text-xl font-bold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(projection.projectedEtfPrice)}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(projection.projectedChangePercent)} ({isPositive ? '+' : ''}{formatCurrency(projection.projectedChange)})
            </span>
          </div>
        </div>

        <div className="bg-white p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">BTC/USD Live</p>
          <p className="text-xl font-bold text-orange-600 mt-1">
            {formatCurrency(projection.btcCurrent)}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {projection.btcChangePercent >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${projection.btcChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(projection.btcChangePercent)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Implied BTC/Share
          </p>
          <p className="text-xl font-bold text-purple-600 mt-1">
            {(projection.etfLastClose / projection.btcCurrent).toFixed(6)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">BTC per ETF share</p>
        </div>
      </div>

      {/* Stop Loss Section */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Stop Loss Alerts
          </h4>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Stop
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="flex items-end gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Stop Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newStopPrice}
                onChange={(e) => setNewStopPrice(e.target.value)}
                placeholder="e.g. 55.00"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Label (optional)</label>
              <input
                type="text"
                value={newStopLabel}
                onChange={(e) => setNewStopLabel(e.target.value)}
                placeholder="e.g. Support level"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={addStopLoss}
              className="px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {/* Stop Loss List */}
        {stopLosses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-3">
            No stop losses set. Add one to monitor overnight BTC movements.
          </p>
        ) : (
          <div className="space-y-2">
            {stopLosses.map((sl) => {
              const distance = projection.projectedEtfPrice - sl.price;
              const distancePct = (distance / projection.projectedEtfPrice) * 100;

              return (
                <div
                  key={sl.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border ${
                    sl.triggered
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        sl.triggered ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sl.label}</p>
                      <p className="text-xs text-gray-500">
                        Stop @ {formatCurrency(sl.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {sl.triggered ? (
                        <span className="text-xs font-medium text-red-600">TRIGGERED</span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {formatCurrency(distance)} away ({formatPercentage(-distancePct)})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeStopLoss(sl.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Projected price based on live BTC/USD movement applied to last ETF close via NAV ratio.
          Actual opening price may differ due to market dynamics and premium/discount.
        </p>
      </div>
    </div>
  );
}
