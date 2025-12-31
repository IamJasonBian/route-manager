import { TrendingUp, TrendingDown, Activity, Bell, BellOff } from 'lucide-react';
import { AssetData, formatCurrency, formatPercentage, formatVolatility, formatLargeNumber } from '../services/assetService';

interface AssetCardProps {
  asset: AssetData;
  onAddAlert?: (assetId: string, assetName: string) => void;
  hasActiveAlert?: boolean;
}

export default function AssetCard({ asset, onAddAlert, hasActiveAlert }: AssetCardProps) {
  const isPositive = asset.priceChangePercent24h >= 0;

  // Generate mini sparkline SVG
  const renderSparkline = () => {
    if (!asset.sparkline7d || asset.sparkline7d.length === 0) return null;

    const prices = asset.sparkline7d;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const width = 100;
    const height = 32;
    const padding = 2;

    const points = prices.map((price, index) => {
      const x = padding + (index / (prices.length - 1)) * (width - padding * 2);
      const y = height - padding - ((price - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const sparklineColor = prices[prices.length - 1] >= prices[0] ? '#22c55e' : '#ef4444';

    return (
      <svg width={width} height={height} className="ml-auto">
        <polyline
          fill="none"
          stroke={sparklineColor}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  const getAssetIcon = () => {
    if (asset.type === 'crypto') {
      return (
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-orange-600 font-bold text-lg">₿</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 font-bold text-sm">S&P</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getAssetIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
            <p className="text-sm text-gray-500">{asset.symbol}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {renderSparkline()}
          {onAddAlert && (
            <button
              onClick={() => onAddAlert(asset.id, asset.name)}
              className={`p-1.5 rounded-lg transition-colors ${
                hasActiveAlert
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={hasActiveAlert ? 'Has active alerts' : 'Add price alert'}
            >
              {hasActiveAlert ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(asset.currentPrice)}</p>
        <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-medium">{formatPercentage(asset.priceChangePercent24h)}</span>
          <span className="text-gray-500 text-sm">24h</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">24h High</p>
          <p className="font-medium text-green-600">{formatCurrency(asset.high24h)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">24h Low</p>
          <p className="font-medium text-red-600">{formatCurrency(asset.low24h)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">7d Change</p>
          <p className={`font-medium ${(asset.priceChangePercent7d ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(asset.priceChangePercent7d)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">30d Change</p>
          <p className={`font-medium ${(asset.priceChangePercent30d ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(asset.priceChangePercent30d)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Volume 24h</p>
          <p className="font-medium text-gray-900">{formatLargeNumber(asset.volume24h)}</p>
        </div>
        <div className="flex items-start gap-1">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              Volatility
              <Activity className="w-3 h-3" />
            </p>
            <p className={`font-medium ${
              (asset.volatility30d ?? 0) > 50 ? 'text-red-600' :
              (asset.volatility30d ?? 0) > 25 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {formatVolatility(asset.volatility30d)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
