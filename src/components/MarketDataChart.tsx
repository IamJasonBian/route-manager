import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import type { PricePoint } from './PriceHistoryChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
);

export interface MarketSeries {
  label: string;
  color: string;
  prices: PricePoint[];
}

interface MarketDataChartProps {
  series: MarketSeries[];
  loading?: boolean;
  error?: string | null;
}

const MarketDataChart: React.FC<MarketDataChartProps> = ({ series, loading, error }) => {
  const chartData = useMemo<ChartData<'line'>>(() => {
    const labels = series[0]?.prices.map(point => point.recorded_at) ?? [];
    const datasets = series.map(asset => ({
      label: asset.label,
      data: asset.prices.map(point => point.price),
      borderColor: asset.color,
      backgroundColor: `${asset.color}22`,
      tension: 0.35,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    }));

    return { labels, datasets };
  }, [series]);

  const options = useMemo<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Market close price comparison',
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 16 },
      },
      tooltip: {
        callbacks: {
          label: context => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
          displayFormats: {
            day: 'MMM d',
            week: 'PP',
            month: 'MMM yyyy',
          },
        },
        ticks: { color: '#6B7280' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#6B7280' },
        title: { display: true, text: 'Close price ($)' },
      },
    },
  }), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="h-96 bg-white rounded-lg shadow-sm p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MarketDataChart;
