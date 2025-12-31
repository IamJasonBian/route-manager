import { useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
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
  type ChartOptions,
  type ChartData
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

export type ChartType = 'line' | 'burn-down' | 'draw-down';

export interface PricePoint {
  price: number;
  recorded_at: string;
}

export interface PriceHistoryChartProps {
  prices: PricePoint[];
  loading?: boolean;
  className?: string;
  chartType?: ChartType;
  title?: string;
}

const calculateBurnDownData = (prices: PricePoint[]): number[] => {
  if (prices.length === 0) return [];

  const maxPrice = Math.max(...prices.map(p => p.price));
  return prices.map(p => maxPrice - p.price);
};

const calculateDrawDownData = (prices: PricePoint[]): number[] => {
  if (prices.length === 0) return [];

  let peak = prices[0].price;
  return prices.map(point => {
    if (point.price > peak) {
      peak = point.price;
    }
    return ((peak - point.price) / peak) * 100;
  });
};

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  prices,
  loading = false,
  className = '',
  chartType = 'line',
  title = 'Price History'
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = useMemo<ChartData<'line'>>(() => {
    const labels = prices.map(p => p.recorded_at);
    let data: number[] = [];
    let label = 'Price ($)';
    let borderColor = 'rgb(59, 130, 246)';
    let backgroundColor = 'rgba(59, 130, 246, 0.1)';

    switch (chartType) {
      case 'burn-down':
        data = calculateBurnDownData(prices);
        label = 'Price Drop ($)';
        borderColor = 'rgb(16, 185, 129)';
        backgroundColor = 'rgba(16, 185, 129, 0.1)';
        break;
      case 'draw-down':
        data = calculateDrawDownData(prices);
        label = 'Draw Down (%)';
        borderColor = 'rgb(239, 68, 68)';
        backgroundColor = 'rgba(239, 68, 68, 0.1)';
        break;
      default:
        data = prices.map(p => p.price);
        break;
    }

    return {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor,
          backgroundColor,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: true,
          borderWidth: 2,
        }
      ]
    };
  }, [prices, chartType]);

  const chartOptions = useMemo<ChartOptions<'line'>>(() => {
    const baseOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: { bottom: 20 }
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              if (chartType === 'draw-down') {
                return `${value.toFixed(2)}%`;
              }
              if (chartType === 'burn-down') {
                return `$${value.toFixed(2)} below peak`;
              }
              return `Price: $${value.toFixed(2)}`;
            }
          }
        }
      },
      elements: {
        line: {
          borderWidth: 2
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM d, yyyy HH:mm'
          },
          title: {
            display: true,
            text: 'Date'
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: chartType === 'draw-down' ? 'Draw Down (%)' : 'Price (USD)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    };

    if (chartType === 'draw-down') {
      baseOptions.scales = {
        ...baseOptions.scales,
        y: {
          ...baseOptions.scales?.y,
          max: 0,
          min: -100,
          reverse: false,
          title: {
            display: true,
            text: 'Draw Down (%)'
          }
        }
      };
    }

    return baseOptions;
  }, [prices, chartType, title]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="animate-pulse text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (!prices || prices.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default PriceHistoryChart;
