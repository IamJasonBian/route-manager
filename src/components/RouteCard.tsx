import React from 'react';
import { MapPinIcon, ClockIcon, ArrowRightIcon, TrendingDownIcon } from 'lucide-react';
import { PriceChart } from './PriceChart';
export const RouteCard = ({
  route
}) => {
  const {
    from,
    to,
    basePrice,
    prices,
    distance,
    duration
  } = route;
  const lowestPrice = Math.min(...prices.map(p => p.price));
  const highestPrice = Math.max(...prices.map(p => p.price));
  const savings = basePrice - lowestPrice;
  return <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {from} <ArrowRightIcon className="inline h-4 w-4 mx-1" /> {to}
              </h3>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{duration}</span>
              <span className="mx-2">•</span>
              <span>{distance}</span>
            </div>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <div className="flex items-center text-green-700">
              <TrendingDownIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Best Deal</span>
            </div>
            <div className="text-xl font-bold text-green-800">
              ${lowestPrice}
            </div>
            {savings > 0 && <div className="text-xs text-green-600">Save ${savings}</div>}
          </div>
        </div>
        <div className="h-48 mt-2">
          <PriceChart prices={prices} basePrice={basePrice} lowestPrice={lowestPrice} highestPrice={highestPrice} />
        </div>
      </div>
    </div>;
};