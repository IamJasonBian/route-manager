import React from 'react';
export const PriceChart = ({
  prices,
  basePrice,
  lowestPrice,
  highestPrice
}) => {
  // Add padding to price range for better visualization
  const padding = 50;
  const minPrice = Math.min(lowestPrice, basePrice) - padding;
  const maxPrice = Math.max(highestPrice, basePrice) + padding;
  const range = maxPrice - minPrice;
  // Calculate bar positions and dimensions
  const barWidth = 90 / prices.length; // Leave some space on edges
  const getX = index => index * (100 / prices.length);
  const getY = price => 100 - (price - minPrice) / range * 100;
  const getHeight = price => (price - minPrice) / range * 100;
  // Format date for tooltip
  const formatDate = date => {
    return date.toLocaleDateString('default', {
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="h-full w-full flex">
      {/* Y-axis price labels - left side */}
      <div className="w-12 flex flex-col justify-between py-2 pr-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-end items-center h-6">
            <span className="text-xs text-gray-500 font-medium">
              ${Math.round(maxPrice - i * range / 4)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Chart container */}
      <div className="flex-1 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-4 gap-0">
          {[...Array(5)].map((_, i) => <div key={i} className="border-t border-gray-100 relative" />)}
        </div>
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Base price line */}
          <path d={`M 0 ${getY(basePrice)} L 100 ${getY(basePrice)}`} stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="2 2" fill="none" />
          {/* Price bars */}
          {prices.map((price, index) => {
            const barHeight = getHeight(price.price);
            const x = getX(index);
            const y = 100 - barHeight;
            const isLower = price.price < basePrice;
            // Calculate tooltip position to prevent overflow
            const tooltipY = y < 30 ? y + barHeight + 5 : y - 25; // Flip tooltip position if too close to top
            const tooltipX = Math.max(30, Math.min(x + (100 / prices.length - 60) / 2, 70)); // Keep tooltip within bounds
            return <g key={index} className="group">
                  {/* Bar */}
                  <rect x={x + (100 / prices.length - barWidth) / 2} y={y} width={barWidth} height={barHeight} className={`${isLower ? 'fill-green-400' : 'fill-blue-400'} transition-opacity duration-200 hover:opacity-80`} rx="1" />
                  {/* Hover tooltip */}
                  <g className="opacity-0 group-hover:opacity-100">
                    <rect x={tooltipX} y={tooltipY} width="60" height="20" rx="4" fill="#1F2937" />
                    <text x={tooltipX + 30} y={tooltipY + 13} textAnchor="middle" fill="white" className="text-[8px]">
                      ${price.price} - {formatDate(price.date)}
                    </text>
                  </g>
                </g>;
          })}
        </svg>
      </div>
      
      {/* Right-side padding element to match left side */}
      <div className="w-12 flex-shrink-0"></div>
    </div>;
};