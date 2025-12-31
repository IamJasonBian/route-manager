import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PriceHistoryChart, { ChartType, PricePoint } from '../components/PriceHistoryChart';
import { getHistoricPrices } from '../services/bitcoinApi';

const PERIOD_OPTIONS = [
  { value: 'day', label: '24 Hours' },
  { value: 'week', label: '7 Days' },
  { value: 'month', label: '30 Days' },
  { value: 'year', label: '12 Months' }
] as const;

type PeriodValue = typeof PERIOD_OPTIONS[number]['value'];

export default function TrendsPage() {
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [period, setPeriod] = useState<PeriodValue>('month');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartTitle = useMemo(() => {
    switch (chartType) {
      case 'burn-down':
        return 'Price Burn Down vs Peak';
      case 'draw-down':
        return 'Draw Down from High (%)';
      default:
        return 'Bitcoin Price History';
    }
  }, [chartType]);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const history = await getHistoricPrices(period);
        setPrices(history);
      } catch (loadError) {
        console.error(loadError);
        setError('Unable to load historical pricing.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadHistory();
  }, [period]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trends</h2>
            <p className="text-gray-600 mt-1">Historical Bitcoin pricing with different analytics lenses.</p>
          </div>
          <Link
            to="/market"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-white"
          >
            Back to Market
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Time range</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPeriod(option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      period === option.value
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chart style</p>
              <div className="flex items-center gap-2 mt-2">
                {(['line', 'burn-down', 'draw-down'] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      chartType === type
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="h-[420px]">
            <PriceHistoryChart
              prices={prices}
              loading={isLoading}
              chartType={chartType}
              title={chartTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
