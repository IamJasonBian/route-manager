import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Bell } from 'lucide-react';
import AssetCard from '../components/AssetCard';
import BitcoinPriceChart from '../components/BitcoinPriceChart';
import AlertManager from '../components/AlertManager';
import ApiKeySetup from '../components/ApiKeySetup';
import {
  AssetData,
  getBitcoinData,
  getSP500Data,
  getStoredApiKey,
} from '../services/assetService';
import { checkAlerts, getAlerts } from '../services/notificationService';

export default function DashboardPage() {
  const [bitcoinData, setBitcoinData] = useState<AssetData | null>(null);
  const [sp500Data, setSp500Data] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sp500Error, setSp500Error] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [, setApiKey] = useState<string | null>(getStoredApiKey());
  const [alertManagerOpen, setAlertManagerOpen] = useState(false);
  const [alertAsset, setAlertAsset] = useState<{ id: string; name: string } | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Fetch Bitcoin data
      const btcData = await getBitcoinData();
      setBitcoinData(btcData);

      // Fetch S&P 500 data if API key is set
      const currentApiKey = getStoredApiKey();
      if (currentApiKey) {
        try {
          const spData = await getSP500Data(currentApiKey);
          setSp500Data(spData);
          setSp500Error(null);
        } catch (err) {
          setSp500Error(err instanceof Error ? err.message : 'Failed to fetch S&P 500 data');
          setSp500Data(null);
        }
      }

      setLastUpdated(new Date());

      // Check alerts
      const prices: Record<string, number> = { bitcoin: btcData.currentPrice };
      checkAlerts(prices);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleApiKeySet = (key: string | null) => {
    setApiKey(key);
    if (key) {
      fetchData(true);
    } else {
      setSp500Data(null);
      setSp500Error(null);
    }
  };

  const handleAddAlert = (assetId: string, assetName: string) => {
    setAlertAsset({ id: assetId, name: assetName });
    setAlertManagerOpen(true);
  };

  const getCurrentPrices = (): Record<string, number> => {
    const prices: Record<string, number> = {};
    if (bitcoinData) prices.bitcoin = bitcoinData.currentPrice;
    if (sp500Data) prices.sp500 = sp500Data.currentPrice;
    return prices;
  };

  const hasActiveAlerts = (assetId: string): boolean => {
    return getAlerts().some(a => a.assetId === assetId && a.enabled && !a.triggered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error && !bitcoinData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Real-time price tracking with volatility analysis
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ApiKeySetup onKeySet={handleApiKeySet} />
          <button
            onClick={() => {
              setAlertAsset(null);
              setAlertManagerOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            <Bell className="w-4 h-4" />
            Alerts
          </button>
          {lastUpdated && (
            <span className="text-sm text-gray-500 hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {bitcoinData && (
          <AssetCard
            asset={bitcoinData}
            onAddAlert={handleAddAlert}
            hasActiveAlert={hasActiveAlerts('bitcoin')}
          />
        )}
        {sp500Data ? (
          <AssetCard
            asset={sp500Data}
            onAddAlert={handleAddAlert}
            hasActiveAlert={hasActiveAlerts('sp500')}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center min-h-[280px]">
            {sp500Error ? (
              <div className="text-center">
                <p className="text-red-600 font-medium mb-2">S&P 500 Error</p>
                <p className="text-sm text-gray-500 mb-4">{sp500Error}</p>
                <button
                  onClick={() => fetchData(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">S&P</span>
                </div>
                <p className="text-gray-900 font-medium mb-1">S&P 500</p>
                <p className="text-sm text-gray-500 mb-4">Add an API key to view S&P 500 data</p>
                <ApiKeySetup onKeySet={handleApiKeySet} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Volatility Comparison */}
      {bitcoinData && sp500Data && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volatility Comparison</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Bitcoin (30d)</span>
                <span className={`font-semibold ${
                  (bitcoinData.volatility30d ?? 0) > 50 ? 'text-red-600' :
                  (bitcoinData.volatility30d ?? 0) > 25 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {bitcoinData.volatility30d?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (bitcoinData.volatility30d ?? 0) > 50 ? 'bg-red-500' :
                    (bitcoinData.volatility30d ?? 0) > 25 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((bitcoinData.volatility30d ?? 0), 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">S&P 500 (30d)</span>
                <span className={`font-semibold ${
                  (sp500Data.volatility30d ?? 0) > 50 ? 'text-red-600' :
                  (sp500Data.volatility30d ?? 0) > 25 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {sp500Data.volatility30d?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (sp500Data.volatility30d ?? 0) > 50 ? 'bg-red-500' :
                    (sp500Data.volatility30d ?? 0) > 25 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((sp500Data.volatility30d ?? 0) * 5, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            30-day annualized volatility. Higher values indicate greater price fluctuation.
          </p>
        </div>
      )}

      {/* Bitcoin Price Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bitcoin Price Chart</h2>
        <BitcoinPriceChart days={30} height={400} />
      </div>

      {/* Alert Manager Modal */}
      <AlertManager
        isOpen={alertManagerOpen}
        onClose={() => {
          setAlertManagerOpen(false);
          setAlertAsset(null);
        }}
        defaultAssetId={alertAsset?.id}
        defaultAssetName={alertAsset?.name}
        currentPrices={getCurrentPrices()}
      />
    </div>
  );
}
