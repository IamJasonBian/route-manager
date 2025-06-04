import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PricePoint {
  price: number;
  recorded_at: string;
}

interface RouteData {
  route_id: string;
  origin: string;
  destination: string;
  prices: PricePoint[];
}

interface ChartDataPoint {
  date: string;
  [key: string]: string | number | null;
}

// Generate mock data for demonstration
const generateMockData = (): RouteData[] => {
  const routes: RouteData[] = [];
  const cities = ['JFK', 'LAX', 'ORD', 'SFO', 'SEA', 'MIA', 'DFW', 'ATL'];
  const today = new Date();
  
  // Generate 5 random routes
  for (let i = 0; i < 5; i++) {
    const origin = cities[Math.floor(Math.random() * cities.length)];
    let destination;
    do {
      destination = cities[Math.floor(Math.random() * cities.length)];
    } while (destination === origin);
    
    const prices: PricePoint[] = [];
    // Generate 30 days of price data
    for (let j = 0; j < 30; j++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (30 - j));
      
      // Generate realistic price between 100 and 500
      const basePrice = 100 + Math.random() * 400;
      // Add some variation to make it look more realistic
      const price = Math.round(basePrice + (Math.random() * 100 - 50));
      
      prices.push({
        price,
        recorded_at: date.toISOString()
      });
    }
    
    routes.push({
      route_id: `route-${i + 1}`,
      origin,
      destination,
      prices
    });
  }
  
  return routes;
};

const RouteSummaryPage = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch routes data on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/routes');
        // const data = await response.json();
        // setRoutes(data);
        
        // For now, use mock data
        const mockData = generateMockData();
        setRoutes(mockData);
        // Auto-select first 3 routes
        setSelectedRoutes(mockData.slice(0, 3).map(route => route.route_id));
      } catch (err) {
        setError('Failed to load route data');
        console.error('Error fetching routes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoutes();
  }, []);
  
  // Toggle route selection
  const toggleRoute = (routeId: string) => {
    setSelectedRoutes(prev => 
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };
  
  // Generate chart data for the selected routes
  const chartData = useMemo(() => {
    if (!routes.length || !selectedRoutes.length) return [];
    
    // Get all unique dates from all selected routes
    const allDates = new Set<string>();
    selectedRoutes.forEach(routeId => {
      const route = routes.find(r => r.route_id === routeId);
      if (route) {
        route.prices.forEach(price => {
          allDates.add(price.recorded_at.split('T')[0]);
        });
      }
    });
    
    // Sort dates
    const sortedDates = Array.from(allDates).sort();
    
    // Create data points for each date
    return sortedDates.map(date => {
      const dataPoint: ChartDataPoint = { date };
      selectedRoutes.forEach(routeId => {
        const route = routes.find(r => r.route_id === routeId);
        if (route) {
          const pricePoint = route.prices.find(p => p.recorded_at.startsWith(date));
          if (pricePoint) {
            dataPoint[`${route.origin}-${route.destination}`] = pricePoint.price;
          }
        }
      });
      return dataPoint;
    });
  }, [routes, selectedRoutes]);
  
  // Get price range for Y-axis
  const getPriceRange = () => {
    if (!selectedRoutes.length) return { min: 0, max: 1000 };
    
    let min = Infinity;
    let max = 0;
    
    selectedRoutes.forEach(routeId => {
      const route = routes.find(r => r.route_id === routeId);
      if (route) {
        route.prices.forEach(price => {
          if (price.price < min) min = price.price;
          if (price.price > max) max = price.price;
        });
      }
    });
    
    // Add 10% padding
    const padding = (max - min) * 0.1;
    return {
      min: Math.max(0, Math.floor(min - padding)),
      max: Math.ceil(max + padding)
    };
  };
  
  // Get color for a route
  const getRouteColor = (routeId: string) => {
    const colors = [
      '#3b82f6', // blue-500
      '#ef4444', // red-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#14b8a6', // teal-500
      '#f97316', // orange-500
    ];
    const index = selectedRoutes.indexOf(routeId);
    return index >= 0 ? colors[index % colors.length] : '#000000';
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
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
    );
  }

  const priceRange = getPriceRange();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Route Price Trends</h1>
      
      {/* Route Selection */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map(route => (
            <div 
              key={route.route_id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRoutes.includes(route.route_id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleRoute(route.route_id)}
            >
              <div className={`w-4 h-4 rounded-full mr-3 ${
                selectedRoutes.includes(route.route_id) 
                  ? 'bg-blue-500' 
                  : 'border-2 border-gray-300'
              }`}></div>
              <div>
                <div className="font-medium text-gray-900">
                  {route.origin} → {route.destination}
                </div>
                <div className="text-sm text-gray-500">
                  {route.prices.length} price points
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Price Trend</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                domain={[priceRange.min, priceRange.max]}
                tickFormatter={(value) => `$${value}`}
                width={80}
              />
              <Tooltip 
                formatter={(value: any, name: any) => [`$${value}`, name]}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              />
              <Legend />
              {selectedRoutes.map(routeId => {
                const route = routes.find(r => r.route_id === routeId);
                if (!route) return null;
                
                const dataKey = `${route.origin}-${route.destination}`;
                const color = getRouteColor(routeId);
                
                return (
                  <Line
                    key={routeId}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RouteSummaryPage;
