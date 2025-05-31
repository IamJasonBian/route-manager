import { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  type ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
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

interface PricePoint {
  price: number;
  recorded_at: string;
}

interface PriceHistoryChartProps {
  prices: PricePoint[];
  loading?: boolean;
  className?: string;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  prices,
  loading = false,
  className = ''
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = {
    labels: prices.map(p => p.recorded_at),
    datasets: [
      {
        label: 'Price ($)',
        data: prices.map(p => p.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`
        }
      }
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
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price ($)'
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className={`relative ${className}`} style={{ minHeight: '400px' }}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : prices.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No price data available
        </div>
      ) : (
        <Line 
          ref={chartRef}
          data={chartData} 
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default PriceHistoryChart;
