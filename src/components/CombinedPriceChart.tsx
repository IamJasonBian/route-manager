import React from 'react';
import { AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Route } from '../services/api';

interface PriceData {
  date: string;
  [key: string]: string | number | null;
}

interface CombinedPriceChartProps {
  routes: Route[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey?: string;
    color: string;
    stroke?: string;
    fill?: string;
    payload: Record<string, unknown>;
  }>;
  label?: string;
}

export const CombinedPriceChart: React.FC<CombinedPriceChartProps> = ({ routes }) => {
  console.log('CombinedPriceChart received routes:', routes);
  if (routes.length === 0) {
    return <div className="h-96 flex items-center justify-center text-gray-500">No route data available</div>;
  }

  // Get all unique dates across all routes
  console.log('Processing prices for routes:', routes.map(r => `${r.from}-${r.to}`));
  
  const allDates = Array.from(
    new Set(
      routes.flatMap(route => {
        console.log(`Route ${route.from}-${route.to} has ${route.prices.length} prices`);
        return route.prices.map(p => 
          typeof p.date === 'string' ? p.date.split('T')[0] : p.date.toISOString().split('T')[0]
        );
      })
    )
  ).sort();
  
  console.log('All unique dates:', allDates);

  // Create a color palette for the routes
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
    '#6366F1', // indigo-500
  ];

  // Prepare chart data
  const chartData = allDates.map(date => {
    const dataPoint: PriceData = { date };
    
    routes.forEach((route, index) => {
      const pricePoint = route.prices.find(p => {
        const pointDate = typeof p.date === 'string' ? p.date : p.date.toISOString();
        return pointDate.startsWith(date);
      });
      
      const routeKey = `${route.id}-${route.from}-${route.to}`;
      dataPoint[routeKey] = pricePoint ? pricePoint.price : null;
      dataPoint[`${routeKey}Color`] = colors[index % colors.length];
    });
    
    return dataPoint;
  });

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{formatDate(label || '')}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => {
              // Extract the route parts from the dataKey (format: id-from-to)
              const parts = entry.dataKey?.split('-') || [];
              const displayName = parts.length > 2 
                ? `${parts[1]} → ${parts[2]}` 
                : entry.dataKey || 'Route';
                
              return (
                <div key={`tooltip-${index}`} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
                  />
                  <span className="text-sm">
                    {displayName}: <span className="font-medium">${entry.value}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-xl p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            {routes.map((route, index) => {
              const routeKey = `${route.id}-${route.from}-${route.to}`; // Include route ID for uniqueness
              const color = colors[index % colors.length];
              return (
                <linearGradient key={`gradient-${routeKey}`} id={`color${routeKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => formatDate(date).split(',')[0]} // Show only month and day
            tick={{ fill: '#9ca3af' }}
            tickMargin={10}
            axisLine={{ stroke: '#4b5563' }}
            tickLine={false}
          />
          <YAxis 
            domain={['dataMin - 50', 'dataMax + 50']}
            tickFormatter={(value) => `$${value}`}
            tick={{ fill: '#9ca3af' }}
            tickMargin={10}
            axisLine={{ stroke: '#4b5563' }}
            tickLine={false}
            width={60}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#f3f4f6'
            }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              // Extract the route parts after the ID
              const parts = (value as string).split('-');
              if (parts.length > 2) {
                // Remove the ID part (first element) and join the rest with arrow
                return <span className="text-gray-300">{`${parts[1]} → ${parts[2]}`}</span>;
              }
              return <span className="text-gray-300">{value}</span>;
            }}
            wrapperStyle={{ color: '#f3f4f6' }}
          />
          {routes.map((route, index) => {
            const routeKey = `${route.id}-${route.from}-${route.to}`;
            const color = colors[index % colors.length];
            const displayName = `${route.from}-${route.to}`;
            
            return (
              <Area
                key={routeKey}
                type="monotone"
                dataKey={routeKey}
                name={displayName}
                stroke={color}
                fillOpacity={1}
                fill={`url(#color${routeKey})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
                connectNulls
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
