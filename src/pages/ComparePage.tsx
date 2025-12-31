import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import PriceCard from '../components/PriceCard';
import { getMultipleCryptos, BitcoinData } from '../services/bitcoinService';

const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'dogecoin', 'ripple'];

export default function ComparePage() {
  const [cryptos, setCryptos] = useState<BitcoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getMultipleCryptos(CRYPTO_IDS);
      setCryptos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compare Cryptocurrencies</h1>
          <p className="text-gray-500 mt-1">
            Track and compare top cryptocurrencies in real-time
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos.map((crypto) => (
          <PriceCard
            key={crypto.id}
            name={crypto.name}
            symbol={crypto.symbol}
            image={crypto.image}
            currentPrice={crypto.current_price}
            priceChange24h={crypto.price_change_24h}
            priceChangePercentage24h={crypto.price_change_percentage_24h}
            marketCap={crypto.market_cap}
            volume24h={crypto.total_volume}
            high24h={crypto.high_24h}
            low24h={crypto.low_24h}
            sparkline={crypto.sparkline_in_7d?.price}
          />
        ))}
      </div>
    </div>
  );
}
