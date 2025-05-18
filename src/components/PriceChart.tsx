import React from 'react';
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
  const range = maxPrice - minPrice;
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate Y position for a price
  const getY = (price: number): number => {
    if (range === 0) return 50; // If all prices are the same, center it
    return 100 - ((price - minPrice) / range * 100);
  };
  
  // Calculate X position for an index
  const getX = (index: number): number => {
    return (index / (prices.length - 1)) * 100;
  };
  
  // Create price ticks for y-axis (5 evenly spaced values)
  const priceTicks = Array.from({ length: 5 }, (_, i) => {
    return Math.round(minPrice + (i * range / 4));
  });
  
  // Select dates for x-axis (start, middle, end)
  const startDate = prices[0]?.date || '';
  const middleDate = prices[Math.floor(prices.length / 2)]?.date || '';
  const endDate = prices[prices.length - 1]?.date || '';
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Chart area with fixed proportions */}
      <div className="flex flex-1 h-full" style={{ minHeight: 0 }}>
        {/* Y-axis labels - narrower to save space */}
        <div className="w-8 flex flex-col justify-between py-1">
          {priceTicks.reverse().map((price, i) => (
            <div key={i} className="flex justify-end items-center">
              <span className="text-xs text-gray-500">
                ${price}
              </span>
            </div>
          ))}
        </div>
        
        {/* Main chart - expanded to fill available space */}
        <div className="flex-1 relative mx-1">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-rows-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-100" />
            ))}
          </div>
          
          {/* Chart SVG with none preserveAspectRatio to fill all available space */}
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Base price line */}
            <line 
              x1="0" y1={getY(basePrice)} 
              x2="100" y2={getY(basePrice)} 
              stroke="#CBD5E1" 
              strokeWidth="0.75" 
              strokeDasharray="2 2" 
            />
            
            {/* Area fill under the line */}
            <path
              d={`
                M 0 ${getY(prices[0]?.price || 0)}
                ${prices.map((price, index) => {
                  return `L ${getX(index)} ${getY(price.price)}`;
                }).join(' ')}
                L 100 100 L 0 100 Z
              `}
              fill="url(#priceGradient)"
              opacity="0.2"
            />
            
            {/* Line connecting all points */}
            <path
              d={`
                M 0 ${getY(prices[0]?.price || 0)}
                ${prices.map((price, index) => {
                  return `L ${getX(index)} ${getY(price.price)}`;
                }).join(' ')}
              `}
              stroke="#3B82F6"
              strokeWidth="1.5"
              fill="none"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {prices.map((price, index) => {
              const x = getX(index);
              const y = getY(price.price);
              const isLower = price.price < basePrice;
              
              return (
                <g key={index} className="group">
                  {/* Point marker */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="2.5"
                    fill={isLower ? '#10B981' : '#3B82F6'}
                    stroke="white"
                    strokeWidth="0.5"
                  />
                  
                  {/* Tooltip */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <rect 
                      x={x - 20} 
                      y={y - 20} 
                      width="40" 
                      height="16" 
                      rx="3" 
                      fill="#1F2937" 
                      stroke="#4B5563"
                      strokeWidth="0.5"
                    />
                    <text 
                      x={x} 
                      y={y - 9} 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="8"
                      fontWeight="bold"
                    >
                      ${price.price}
                    </text>
                  </g>
                </g>
              );
            })}
            
            {/* Gradient definition for area fill */}
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Right padding - reduced */}
        <div className="w-2"></div>
      </div>
      
      {/* X-axis dates - compact */}
      <div className="flex justify-between px-8 h-5 text-xs text-gray-500">
        <div>{formatDate(startDate)}</div>
        <div>{formatDate(middleDate)}</div>
        <div>{formatDate(endDate)}</div>
      </div>
    </div>
  );
};