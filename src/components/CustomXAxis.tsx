import React from 'react';
import { XAxis, XAxisProps } from 'recharts';

interface CustomXAxisProps extends XAxisProps {
  data: Array<{ formattedDate: string }>;
}

export const CustomXAxis: React.FC<CustomXAxisProps> = ({ data, ...props }) => {
  // Get the start, middle, and end dates
  const ticks = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return [
      { value: data[0]?.formattedDate, position: 'start' },
      { value: data[Math.floor(data.length / 2)]?.formattedDate, position: 'middle' },
      { value: data[data.length - 1]?.formattedDate, position: 'end' }
    ].filter(item => item.value);
  }, [data]);

  return (
    <XAxis
      {...props}
      axisLine={false}
      tickLine={false}
      tickMargin={5}
      tick={{ fontSize: 10, fill: '#6B7280' }}
      ticks={ticks.map(t => t.value)}
      interval={0}
    >
      {/* Custom render for each tick to ensure unique keys */}
      {ticks.map((tick, index) => (
        <g
          key={`tick-${tick.position}-${index}`}
          className="recharts-layer recharts-cartesian-axis-tick"
          transform={`translate(${(index / (ticks.length - 1)) * 100}%,0)`}
        >
          <text
            width="30"
            height="30"
            stroke="none"
            fill="#6B7280"
            className="recharts-text recharts-cartesian-axis-tick-value"
            textAnchor="middle"
            fontSize={10}
            x={0}
            y={15}
          >
            {tick.value}
          </text>
        </g>
      ))}
    </XAxis>
  );
};
