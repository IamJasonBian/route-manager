import React from 'react';
import { 
  AreaChart, Area, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { UniqueKeyXAxis } from './UniqueKeyXAxis';
import { FlightPrice } from '../services/api';

interface PriceChartProps {
  prices: FlightPrice[];
  basePrice: number;
  lowestPrice: number;
  highestPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ prices, basePrice, lowestPrice, highestPrice }) => {
  // Ensure we have prices to display
  if (!prices.length) return <div className="h-full w-full flex items-center justify-center text-gray-500">No price data available</div>;
  
  // Calculate the price range for the chart with padding
  const minPrice = Math.floor(Math.min(lowestPrice, basePrice) * 0.95);
  const maxPrice = Math.ceil(Math.max(highestPrice, basePrice) * 1.05);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format data for Recharts
  const chartData = prices.map(price => ({
    date: price.date,
    price: price.price,
    formattedDate: formatDate(price.date.toString())
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: Array<{ value: number, payload: { date: string | Date } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white text-xs p-2 rounded shadow">
          <p className="font-bold">${payload[0].value}</p>
          <p>{formatDate(payload[0].payload.date.toString())}</p>
        </div>
      );
    }
    return null;
  };

  // Custom dot component to style points
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isLower = payload.price < basePrice;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={3}
        fill={isLower ? '#10B981' : '#3B82F6'}
        stroke="white"
        strokeWidth={1}
      />
    );
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <UniqueKeyXAxis 
              data={chartData}
              dataKey="formattedDate"
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              width={30}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              tickFormatter={(value) => `$${value}`}
              tickCount={5}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={basePrice} 
              stroke="#CBD5E1" 
              strokeDasharray="3 3" 
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fill="url(#priceGradient)" 
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: "#3B82F6", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* X-axis dates - compact */}
      <div className="flex justify-between px-8 h-5 text-xs text-gray-500">
        <div>{formatDate(chartData[0]?.date.toString())}</div>
        <div>{formatDate(chartData[Math.floor(chartData.length / 2)]?.date.toString())}</div>
        <div>{formatDate(chartData[chartData.length - 1]?.date.toString())}</div>
      </div>
    </div>
  );
};