import React, { useState, useEffect } from 'react';
import { MapPinIcon, ClockIcon, ArrowRightIcon, TrendingDownIcon, ExternalLinkIcon, Loader2 } from 'lucide-react';
import PriceHistoryChart from './PriceHistoryChart';
import { getPriceHistory } from '../services/api';
// Helper function to generate a Google Flights URL for one-day flights starting from today
const getGoogleFlightsUrl = (from: string, to: string): string => {
  // Get today's date and tomorrow's date for a one-day flight
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Format dates as YYYY-MM-DD
  const departDate = today.toISOString().split('T')[0];
  const returnDate = tomorrow.toISOString().split('T')[0];
  
  // Build the URL with proper parameters for Google Flights
  return `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(to)}%20from%20${encodeURIComponent(from)}%20on%20${departDate}%20through%20${returnDate}&curr=USD`;
};

interface RouteCardProps {
  route: {
    id: string;
    from: string;
    to: string;
    basePrice: number;
    prices: Array<{ date: string | Date; price: number }>;
    distance: string;
    duration: string;
  };
  onLoad?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onLoad
}) => {
  const [priceHistory, setPriceHistory] = useState<Array<{ date: string; price: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = React.useRef(false);
  
  // Load price history when component mounts
  useEffect(() => {
    const loadPriceHistory = async () => {
      try {
        const history = await getPriceHistory(route.from, route.to);
        if (isMounted.current) {
          setPriceHistory(history.prices);
        }
      } catch (error) {
        console.error('Error loading price history:', error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    isMounted.current = true;
    loadPriceHistory();
    
    if (onLoad) {
      onLoad();
    }

    return () => {
      isMounted.current = false;
    };
  }, [route.from, route.to, onLoad]);

  const {
    from,
    to,
    basePrice,
    prices,
    distance,
    duration
  } = route;
  
  const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
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
            <a 
              href={getGoogleFlightsUrl(from, to)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-xs text-blue-600 mt-2 hover:text-blue-800 transition-colors"
            >
              <ExternalLinkIcon className="h-3 w-3 mr-1" />
              View on Google Flights
            </a>
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
        <div className="h-40 mt-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <PriceHistoryChart 
              prices={priceHistory.length > 0 ? priceHistory.map(p => ({
                price: p.price,
                recorded_at: p.date
              })) : []} 
            />
          )}
        </div>
      </div>
    </div>;
};