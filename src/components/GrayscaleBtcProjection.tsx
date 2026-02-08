import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';
import { getGrayscaleBtcEtfQuote, EtfQuote } from '../services/twelveDataService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

// Each share of Grayscale Bitcoin Mini Trust ETF represents this many BTC
// This slowly decreases due to the 0.15% annual sponsor fee
const BTC_PER_SHARE = 0.00044246;

interface StopLoss {
  price: number;
  label: string;
}

interface GrayscaleBtcProjectionProps {
  btcPrice: number;
}

export default function GrayscaleBtcProjection({ btcPrice }: GrayscaleBtcProjectionProps) {
  const [etfQuote, setEtfQuote] = useState<EtfQuote | null>(null);
  const [etfError, setEtfError] = useState<string | null>(null);
  const [stopLosses, setStopLosses] = useState<StopLoss[]>(() => {
    const saved = localStorage.getItem('grayscale-btc-stop-losses');
    return saved ? JSON.parse(saved) : [];
  });
  const [newStopPrice, setNewStopPrice] = useState('');
  const [newStopLabel, setNewStopLabel] = useState('');

  useEffect(() => {
    getGrayscaleBtcEtfQuote()
      .then(setEtfQuote)
      .catch((err) => setEtfError(err instanceof Error ? err.message : 'Failed to fetch ETF data'));
  }, []);

  useEffect(() => {
    localStorage.setItem('grayscale-btc-stop-losses', JSON.stringify(stopLosses));
  }, [stopLosses]);

  const projectedPrice = btcPrice * BTC_PER_SHARE;
  const lastClose = etfQuote?.close ?? null;
  const gapFromClose = lastClose !== null ? projectedPrice - lastClose : null;
  const gapPercent = lastClose !== null && lastClose > 0 ? (gapFromClose! / lastClose) * 100 : null;

  const addStopLoss = () => {
    const price = parseFloat(newStopPrice);
    if (isNaN(price) || price <= 0) return;
    setStopLosses((prev) => [...prev, { price, label: newStopLabel || `Stop @ ${formatCurrency(price)}` }]);
    setNewStopPrice('');
    setNewStopLabel('');
  };

  const removeStopLoss = (index: number) => {
    setStopLosses((prev) => prev.filter((_, i) => i !== index));
  };

  const triggeredStops = stopLosses.filter((sl) => projectedPrice <= sl.price);
  const hasTriggeredStops = triggeredStops.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${hasTriggeredStops ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Grayscale BTC Mini Trust ETF</h3>
            <p className="text-sm text-gray-500">NYSE: BTC &middot; {BTC_PER_SHARE} BTC/share</p>
          </div>
        </div>
        {hasTriggeredStops && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            Stop triggered
          </div>
        )}
      </div>

      {/* Projected vs Last Close */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium mb-1">Projected Price (Live BTC)</p>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(projectedPrice)}</p>
          <p className="text-xs text-purple-500 mt-1">
            BTC {formatCurrency(btcPrice)} &times; {BTC_PER_SHARE}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium mb-1">Last ETF Close</p>
          {etfError ? (
            <p className="text-sm text-amber-600">{etfError}</p>
          ) : lastClose !== null ? (
            <>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(lastClose)}</p>
              <p className="text-xs text-gray-500 mt-1">{etfQuote?.datetime}</p>
            </>
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>

        <div className={`rounded-lg p-4 ${gapFromClose !== null && gapFromClose >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="text-sm font-medium mb-1" style={{ color: gapFromClose !== null && gapFromClose >= 0 ? '#16a34a' : '#dc2626' }}>
            Overnight Gap
          </p>
          {gapFromClose !== null && gapPercent !== null ? (
            <>
              <div className="flex items-center gap-1.5">
                {gapFromClose >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <p className={`text-2xl font-bold ${gapFromClose >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {formatPercentage(gapPercent)}
                </p>
              </div>
              <p className={`text-xs mt-1 ${gapFromClose >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gapFromClose >= 0 ? '+' : ''}{formatCurrency(gapFromClose)} per share
              </p>
            </>
          ) : (
            <p className="text-gray-400">--</p>
          )}
        </div>
      </div>

      {/* BTC Price → ETF Reference Table */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Reference</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {[60000, 70000, 80000, 90000, 100000, 120000].map((price) => (
            <div key={price} className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">BTC {(price / 1000).toFixed(0)}K</p>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(price * BTC_PER_SHARE)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stop-Loss Management */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Stop-Loss Tracker</h4>
        <p className="text-xs text-gray-500 mb-3">
          BTC trades 24/7 — set ETF price levels to monitor overnight. Triggered stops highlight when projected ETF price falls below your level.
        </p>

        {/* Existing stop losses */}
        {stopLosses.length > 0 && (
          <div className="space-y-2 mb-3">
            {stopLosses.map((sl, i) => {
              const triggered = projectedPrice <= sl.price;
              const distancePercent = lastClose ? ((sl.price - projectedPrice) / projectedPrice) * 100 : null;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    triggered ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {triggered && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <span className={triggered ? 'text-red-700 font-medium' : 'text-gray-700'}>{sl.label}</span>
                    <span className={`font-mono ${triggered ? 'text-red-600' : 'text-gray-600'}`}>
                      {formatCurrency(sl.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {distancePercent !== null && (
                      <span className={`text-xs ${triggered ? 'text-red-500' : 'text-gray-400'}`}>
                        {triggered ? 'TRIGGERED' : `${distancePercent > 0 ? distancePercent.toFixed(1) + '% away' : 'above'}`}
                      </span>
                    )}
                    <button
                      onClick={() => removeStopLoss(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new stop loss */}
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            placeholder="ETF price level"
            value={newStopPrice}
            onChange={(e) => setNewStopPrice(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Label (optional)"
            value={newStopLabel}
            onChange={(e) => setNewStopLabel(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={addStopLoss}
            disabled={!newStopPrice || isNaN(parseFloat(newStopPrice))}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
