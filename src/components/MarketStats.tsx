import { DollarSign, BarChart3, Coins, TrendingUp, Award, Calendar } from 'lucide-react';
import { MarketData, formatCurrency, formatLargeNumber, formatPercentage } from '../services/bitcoinService';

interface MarketStatsProps {
  marketData: MarketData;
  loading?: boolean;
}

export default function MarketStats({ marketData, loading }: MarketStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Market Cap',
      value: formatLargeNumber(marketData.market_cap),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '24h Volume',
      value: formatLargeNumber(marketData.total_volume),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Circulating Supply',
      value: `${(marketData.circulating_supply / 1e6).toFixed(2)}M BTC`,
      icon: Coins,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: '7d Change',
      value: formatPercentage(marketData.price_change_percentage_7d),
      icon: TrendingUp,
      color: marketData.price_change_percentage_7d >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: marketData.price_change_percentage_7d >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'All-Time High',
      value: formatCurrency(marketData.ath),
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'ATH Date',
      value: new Date(marketData.ath_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      icon: Calendar,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className="text-sm text-gray-500">{stat.label}</span>
          </div>
          <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
