import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import PriceHistoryChart from './PriceHistoryChart';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if add button should be enabled
  const isAddDisabled = !origin || !destination || origin === destination || isLoading;

  // Fetch price history from the API
  const fetchPriceHistory = async (origin, destination) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/.netlify/functions/flight-prices?from=${origin}&to=${destination}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Not a JSON response');
      }
      
      const data = await response.json();
      return {
        route: { origin, destination },
        prices: data.prices.map(item => ({
          price: parseFloat(item.price),
          recorded_at: item.date
        }))
      };
    } catch (error) {
      console.error('Error fetching price history:', error);
      setError('Failed to fetch price history. Using mock data instead.');
      return generateMockPriceData(origin, destination);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock price data (fallback)
  const generateMockPriceData = (origin, destination) => {
    const basePrice = 200 + (origin.charCodeAt(0) + destination.charCodeAt(0)) % 100;
    const prices = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      prices.push({
        price: Math.round((basePrice + (Math.random() * 100 - 20)) * 100) / 100,
        recorded_at: date.toISOString()
      });
    }
    
    return {
      route: { origin, destination },
      prices: prices.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))
    };
  };

  // Add a new route
  const addRoute = async () => {
    const routeKey = `${origin}-${destination}`;
    
    // Check if route already exists
    if (routes.some(route => 
      route.route.origin === origin && route.route.destination === destination
    )) {
      alert('This route is already added');
      return;
    }
    
    try {
      const priceData = await fetchPriceHistory(origin, destination);
      setRoutes(prevRoutes => [...prevRoutes, priceData]);
      
      // Reset form
      setOrigin('');
      setDestination('');
    } catch (error) {
      console.error('Error adding route:', error);
      setError('Failed to add route. Please try again.');
    }
  };
  
  // Remove a route
  const removeRoute = (index) => {
    setRoutes(prevRoutes => prevRoutes.filter((_, i) => i !== index));
  };
  
  // Clear all routes
  const clearRoutes = () => {
    setRoutes([]);
    setError(null);
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Flight Price History</h1>
      
      <div className="controls flex flex-wrap gap-3 mb-6">
        <select 
          className="border rounded px-3 py-2"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        >
          <option value="">Select Origin</option>
          <option value="JFK">New York (JFK)</option>
          <option value="LAX">Los Angeles (LAX)</option>
          <option value="ORD">Chicago (ORD)</option>
          <option value="SFO">San Francisco (SFO)</option>
        </select>
        
        <select 
          className="border rounded px-3 py-2"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="">Select Destination</option>
          <option value="LAX">Los Angeles (LAX)</option>
          <option value="JFK">New York (JFK)</option>
          <option value="SFO">San Francisco (SFO)</option>
          <option value="ORD">Chicago (ORD)</option>
        </select>
        
        <button
          className={`px-4 py-2 rounded text-white ${isAddDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={addRoute}
          disabled={isAddDisabled}
        >
          {isLoading ? 'Loading...' : 'Add Route'}
        </button>
        
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={clearRoutes}
          disabled={routes.length === 0}
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          {error}
        </div>
      )}

      <div className="selected-routes mb-6">
        {routes.length > 0 ? (
          <div className="routes-list">
            <h3 className="text-lg font-medium mb-2">Selected Routes:</h3>
            <ul className="border rounded divide-y">
              {routes.map((route, index) => (
                <li key={`${route.route.origin}-${route.route.destination}-${index}`} 
                    className="flex justify-between items-center p-3 hover:bg-gray-50">
                  <span>{route.route.origin} to {route.route.destination}</span>
                  <button
                    className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700"
                    onClick={() => removeRoute(index)}
                    aria-label="Remove route"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No routes selected. Add routes to compare price history.</p>
        )}
      </div>
      
      <div className="chart-container bg-white p-4 rounded-lg shadow">
        <PriceHistoryChart routesData={routes} />
      </div>
    </div>
  );
}

// Initialize the React app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
