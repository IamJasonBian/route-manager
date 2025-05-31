import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PriceHistoryChart from '../components/PriceHistoryChart';
import { getPriceHistory } from '../services/api';

interface PricePoint {
  price: number;
  recorded_at: string;
}

export default function PriceTrendsPage() {
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceTrends = async () => {
      try {
        setIsLoading(true);
        // Example route - in a real app, this would be dynamic based on user selection
        const response = await getPriceHistory('JFK', 'LHR');
        
        // Transform the prices array to match the expected format
        const formattedPrices = response.prices.map(item => ({
          price: item.price,
          recorded_at: item.date
        }));
        
        setPrices(formattedPrices);
        setError(null);
      } catch (err) {
        console.error('Error fetching price trends:', err);
        setError('Failed to load price trends. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceTrends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-blue-600 hover:underline mr-4">
            &larr; Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Price Trends</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Flight Price History</h2>
            <p className="text-sm text-gray-500">
              Track price changes over time for your selected route
            </p>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <select
                  id="origin"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>New York (JFK)</option>
                  <option>London (LHR)</option>
                  <option>San Francisco (SFO)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select
                  id="destination"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>London (LHR)</option>
                  <option>New York (JFK)</option>
                  <option>Tokyo (NRT)</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Chart
                </button>
              </div>
            </div>
            
            <div className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 h-full">
                  <PriceHistoryChart prices={prices} loading={isLoading} />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Alerts</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set up price alerts to be notified when prices drop for this route.
            </p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
