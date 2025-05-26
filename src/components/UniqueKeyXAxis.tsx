import React from 'react';
import { XAxis, XAxisProps } from 'recharts';

interface UniqueKeyXAxisProps extends XAxisProps {
  data: Array<{ formattedDate: string }>;
}

export const UniqueKeyXAxis: React.FC<UniqueKeyXAxisProps> = ({
  data,
  ...props
}) => {
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
      tickCount={3}
      minTickGap={20}
      tickMargin={5}
      tick={{ fontSize: 10, fill: '#6B7280' }}
      // Use the tick values directly
      ticks={ticks.map(t => t.value)}
      // Add a custom key to force re-render when data changes
      key={`xaxis-${data.length}`}
    />
  );
};
