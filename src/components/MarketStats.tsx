import { DollarSign, BarChart3, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { BitcoinQuote } from '../services/twelveDataService';

interface MarketStatsProps {
  quoteData: BitcoinQuote;
  loading?: boolean;
}

export default function MarketStats({ quoteData, loading }: MarketStatsProps) {
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

  const isPositive = quoteData.change >= 0;

  const stats = [
    {
      label: 'Open',
      value: formatCurrency(quoteData.open),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Volume',
      value: formatLargeNumber(quoteData.volume),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Previous Close',
      value: formatCurrency(quoteData.previous_close),
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Change',
      value: formatPercentage(quoteData.percent_change),
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
    },
    {
      label: 'Day High',
      value: formatCurrency(quoteData.high),
      icon: ArrowUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Day Low',
      value: formatCurrency(quoteData.low),
      icon: ArrowDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
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
