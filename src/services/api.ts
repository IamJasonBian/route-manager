import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://apollo-route-manager.windsurf.build/.netlify/functions'
  : 'http://localhost:8888/.netlify/functions';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interface for flight price data
export interface FlightPrice {
  date: string | Date;
  price: number;
}

// Interface for route data
export interface Route {
  id: string;
  from: string;
  to: string;
  basePrice: number;
  prices: FlightPrice[];
  distance: string;
  duration: string;
}

// Get flight prices for a route over time
export const getFlightPrices = async (from: string, to: string, departDate: string): Promise<FlightPrice[]> => {
  try {
    console.log(`Fetching prices from ${from} to ${to} for ${departDate}`);
    
    // Call our Netlify function to get flight prices
    const response = await apiClient.get(`/flight-prices?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    
    if (response.data && response.data.prices) {
      console.log(`Received ${response.data.prices.length} prices from ${response.data.source} source`);
      
      // Convert date strings to Date objects for compatibility
      return response.data.prices.map((price: any) => ({
        date: new Date(price.date),
        price: price.price
      }));
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching flight prices:', error);
    // Fall back to mock data on error
    const routeHash = from.charCodeAt(0) + to.charCodeAt(0);
    const basePrice = 400 + (routeHash % 500); // Generate a base price between 400-900 based on route
    console.warn('Falling back to mock data');
    return generateMockPrices(basePrice);
  }
};

// This function is no longer used due to CORS restrictions
// Keeping the implementation commented for reference if a backend proxy is implemented later
/*
const generateDatesAroundDate = (dateStr: string, numDays: number): Date[] => {
  const centerDate = new Date(dateStr);
  const dates: Date[] = [];
  
  // Generate dates before and after the center date
  for (let i = -Math.floor(numDays/2); i <= Math.floor(numDays/2); i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};
*/

// Get available routes
export const getRoutes = async (): Promise<Route[]> => {
  try {
    console.log('Fetching popular routes');
    
    // Call our Netlify function to get popular routes
    const response = await apiClient.get('/popular-routes');
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`[API] Received ${response.data.length} routes`);
      
      // Log the raw response for debugging
      console.log('[API] Raw response data:', JSON.stringify(response.data, null, 2));
      
      // Convert date strings to Date objects for compatibility
      const processedData = response.data.map((route: any) => {
        console.log(`[API] Processing route: ${route.origin} to ${route.destination}`);
        console.log(`[API] Raw prices data:`, JSON.stringify(route.prices, null, 2));
        
        const processedRoute = {
          ...route,
          prices: route.prices.map((price: any) => ({
            date: new Date(price.date),
            price: price.price
          }))
        };
        
        console.log(`[API] Processed route data:`, JSON.stringify({
          ...processedRoute,
          prices: processedRoute.prices.map((p: any) => ({
            date: p.date.toISOString().split('T')[0],
            price: p.price
          }))
        }, null, 2));
        
        return processedRoute;
      });
      
      return processedData;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching routes:', error);
    
    // Fallback to minimal mock data if everything fails
    console.warn('Falling back to mock route data');
    return [
      {
        id: '1',
        from: 'New York',
        to: 'London',
        basePrice: 550,
        prices: generateMockPrices(550),
        distance: '3,461 miles',
        duration: '7h 25m'
      },
      {
        id: '2',
        from: 'New York',
        to: 'Seattle',
        basePrice: 450,
        prices: generateMockPrices(450),
        distance: '2,421 miles',
        duration: '6h 10m'
      }
    ];
  }
};

// Helper function to generate mock price data for one-day flights starting from today
const generateMockPrices = (basePrice: number = 550): FlightPrice[] => {
  const today = new Date();
  const prices: FlightPrice[] = [];
  
  // Generate prices for the next 30 days (one-day flights)
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Generate a more realistic price variation pattern
    // Prices tend to increase as the departure date approaches, with some random fluctuations
    // Weekends (Friday, Saturday, Sunday) tend to be more expensive
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    
    // Base variation: cheaper further out, more expensive closer to departure
    const daysOut = 30 - i;
    const timeBasedVariation = -50 + (30 - daysOut) * 3; // Gradually increases as departure approaches
    
    // Weekend premium
    const weekendPremium = isWeekend ? 40 : 0;
    
    // Random fluctuation
    const randomVariation = Math.random() * 80 - 40; // -40 to +40
    
    // Some days are promotional deals (about 20% chance)
    const isPromotion = Math.random() < 0.2;
    const promotionDiscount = isPromotion ? -80 - Math.random() * 50 : 0; // -80 to -130 discount
    
    // Combine all factors
    const totalVariation = timeBasedVariation + weekendPremium + randomVariation + promotionDiscount;
    const price = Math.max(Math.round(basePrice + totalVariation), Math.round(basePrice * 0.6)); // Ensure price doesn't go too low
    
    prices.push({
      date,
      price
    });
  }
  
  return prices;
};
