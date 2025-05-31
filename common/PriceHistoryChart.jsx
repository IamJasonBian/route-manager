import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ac'];

const formatXAxis = (tickItem) => {
  return format(parseISO(tickItem), 'MMM d');
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow">
        <p className="font-medium">{format(parseISO(label), 'PPP')}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: $${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PriceHistoryChart({ routesData }) {
  if (!routesData || routesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available. Add routes to see the price history.</p>
      </div>
    );
  }

  // Transform data for Recharts
  const allDates = new Set();
  const routeDataMap = new Map();

  routesData.forEach((route, routeIndex) => {
    const routeKey = `${route.route.origin}-${route.route.destination}`;
    routeDataMap.set(routeKey, {});
    
    route.prices.forEach(price => {
      const dateStr = new Date(price.recorded_at).toISOString().split('T')[0];
      allDates.add(dateStr);
      routeDataMap.get(routeKey)[dateStr] = price.price;
    });
  });

  // Create data array with all dates
  const sortedDates = Array.from(allDates).sort();
  const chartData = sortedDates.map(date => {
    const dataPoint = { date };
    routeDataMap.forEach((prices, routeKey) => {
      dataPoint[routeKey] = prices[date] || null;
    });
    return dataPoint;
  });

  return (
    <div className="w-full h-[500px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {routesData.map((route, index) => {
            const routeKey = `${route.route.origin}-${route.route.destination}`;
            return (
              <Line
                key={routeKey}
                type="monotone"
                dataKey={routeKey}
                name={`${route.route.origin} → ${route.route.destination}`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
