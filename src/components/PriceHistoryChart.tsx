import { useRef, useMemo } from 'react';
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
  type ChartOptions,
  type ChartData
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

export type ChartType = 'line' | 'burn-down' | 'draw-down';

export interface FlightDetails {
  carrier?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;
  bookingClass?: string;
}

export interface PricePoint {
  price: number;
  recorded_at: string;
  flightDetails?: FlightDetails;
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
    return ((peak - point.price) / peak) * 100; // Return as percentage
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
      default: // 'line'
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
              const pricePoint = prices[context.dataIndex];
              const labels: string[] = [];

              // Add price label
              if (chartType === 'draw-down') {
                labels.push(`${value.toFixed(2)}%`);
              } else if (chartType === 'burn-down') {
                labels.push(`$${value.toFixed(2)} below peak`);
              } else {
                labels.push(`Price: $${value.toFixed(2)}`);
              }

              // Add flight details if available
              if (pricePoint?.flightDetails) {
                const fd = pricePoint.flightDetails;
                if (fd.flightNumber) {
                  labels.push(`Flight: ${fd.flightNumber}`);
                }
                if (fd.stops !== undefined) {
                  labels.push(`Stops: ${fd.stops === 0 ? 'Nonstop' : fd.stops}`);
                }
                if (fd.duration) {
                  // Convert PT8H30M to 8h 30m
                  const duration = fd.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
                  labels.push(`Duration: ${duration}`);
                }
                if (fd.bookingClass) {
                  labels.push(`Class: ${fd.bookingClass}`);
                }
              }

              return labels;
            },
            title: (context) => {
              const pricePoint = prices[context[0].dataIndex];
              if (pricePoint?.flightDetails?.departureTime) {
                const date = new Date(pricePoint.flightDetails.departureTime);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
              }
              return context[0].label;
            }
          }
        }
      },
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 3,
          hoverRadius: 5,
          hoverBorderWidth: 2
        }
      },
      animation: {
        duration: 1000
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
    };

    // Add time scale configuration
    const timeScale = {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        tooltipFormat: 'PP',
        displayFormats: {
          day: 'MMM d',
          week: 'PP',
          month: 'MMM yyyy',
        }
      },
      title: {
        display: true,
        text: 'Date',
        color: '#6B7280'
      },
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280'
      }
    };

    // Add y-axis configuration
    const yAxis = {
      beginAtZero: chartType === 'burn-down',
      title: {
        display: true,
        text: chartType === 'draw-down' ? 'Draw Down (%)' : 
              chartType === 'burn-down' ? 'Price Drop ($)' : 'Price ($)',
        color: '#6B7280'
      },
      ticks: {
        callback: (value: string | number) => {
          if (chartType === 'draw-down') {
            return `${value}%`;
          }
          return `$${value}`;
        },
        color: '#6B7280'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    };

    // Return the final options with proper typing
    return {
      ...baseOptions,
      scales: {
        x: timeScale as any, // Type assertion needed due to Chart.js type definitions
        y: yAxis as any
      }
    };
  }, [chartType, title]);

  return (
    <div className={`relative bg-white rounded-lg shadow p-4 ${className}`} style={{ minHeight: '400px' }}>
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
          className="h-full w-full"
        />
      )}
    </div>
  );
};

export default PriceHistoryChart;
