import axios from 'axios';
import { saveRoute, getRoutes as getDbRoutes } from './routeService';

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

// Helper function to convert between API and DB route formats
const toDbRoute = (route: Route) => {
  const firstPrice = route.prices[0];
  const secondPrice = route.prices[1];
  
  return {
    origin: route.from,
    destination: route.to,
    price: route.basePrice,
    departure_date: firstPrice ? (firstPrice.date instanceof Date ? firstPrice.date : new Date(firstPrice.date)) : new Date(),
    return_date: secondPrice ? (secondPrice.date instanceof Date ? secondPrice.date : new Date(secondPrice.date)) : null,
    airline: 'Unknown',
    flight_number: `FLT-${Math.floor(1000 + Math.random() * 9000)}`
  };
};

// Helper function to convert between DB and API route formats
const toApiRoute = (dbRoute: any): Route => {
  const departureDate = new Date(dbRoute.departure_date);
  const returnDate = dbRoute.return_date ? new Date(dbRoute.return_date) : null;
  
  return {
    id: dbRoute.id.toString(),
    from: dbRoute.origin,
    to: dbRoute.destination,
    basePrice: parseFloat(dbRoute.price) || 0,
    distance: '0 km',
    duration: '0h 0m',
    prices: [
      { date: departureDate, price: parseFloat(dbRoute.price) || 0 },
      ...(returnDate ? [{ date: returnDate, price: parseFloat(dbRoute.price) || 0 }] : [])
    ],
    meta: {
      fromCode: dbRoute.origin,
      toCode: dbRoute.destination,
      source: 'database',
      lowestPrice: parseFloat(dbRoute.price) || 0,
      highestPrice: parseFloat(dbRoute.price) || 0
    }
  };
};

// Interface for flight price data
export interface FlightPrice {
  date: string | Date;
  price: number;
}

// Interface for route metadata
export interface RouteMeta {
  fromCode: string;
  toCode: string;
  source: string;
  lowestPrice?: number;
  highestPrice?: number;
  _error?: string; // Optional error message for fallback routes
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
  meta: RouteMeta;
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

// Type guard to validate route data
const isValidRoute = (data: any): data is Route => {
  return (
    typeof data.id === 'string' &&
    typeof data.from === 'string' &&
    typeof data.to === 'string' &&
    typeof data.basePrice === 'number' &&
    typeof data.distance === 'string' &&
    typeof data.duration === 'string' &&
    Array.isArray(data.prices) &&
    data.prices.every((p: any) => 
      p && 
      typeof p.price === 'number' &&
      (p.date instanceof Date || !isNaN(new Date(p.date).getTime()))
    )
  );
};

// Get available routes with database fallback
export const getRoutes = async (): Promise<Route[]> => {
  try {
    // First try to get routes from the database
    console.log('Fetching routes from database...');
    const dbRoutes = await getDbRoutes();
    
    if (dbRoutes && dbRoutes.length > 0) {
      console.log(`Successfully fetched ${dbRoutes.length} routes from database`);
      return dbRoutes.map(toApiRoute);
    }
    
    // If no routes in database, fetch from the API
    console.log('No routes in database, fetching from API...');
    const response = await axios.get<Route[]>('https://api.example.com/routes');
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`Successfully fetched ${response.data.length} routes from API`);
      
      // Validate all routes in the response
      const validRoutes = response.data.filter(route => {
        const isValid = isValidRoute(route);
        if (!isValid) {
          console.warn('Invalid route data received from API:', route);
        }
        return isValid;
      });
      
      if (validRoutes.length > 0) {
        // Save the valid routes to the database
        await Promise.all(validRoutes.map(route => saveRoute(toDbRoute(route))));
        console.log(`Saved ${validRoutes.length} routes to database`);
        return validRoutes;
      }
    }
    
    // If we get here, both database and API failed, try fallback
    console.warn('No valid routes found, falling back to mock data');
    const fallbackRoutes = generateFallbackRoutes();
    
    // Save fallback routes to database for next time
    if (fallbackRoutes.length > 0) {
      await Promise.all(fallbackRoutes.map(route => saveRoute(toDbRoute(route))));
    }
    
    return fallbackRoutes;
  } catch (error) {
    console.error('Error in getRoutes:', error);
    
    // Final fallback to mock data
    console.warn('Falling back to mock data due to error');
    return generateFallbackRoutes();
  }
};

// Generate fallback routes when API fails
export const generateFallbackRoutes = (): Route[] => {
  console.warn('Generating fallback routes');
  
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  // Helper function to create a route with proper date handling
  const createRoute = (
    id: string, 
    from: string, 
    to: string, 
    basePrice: number,
    fromCode: string,
    toCode: string,
    distance: string,
    duration: string
  ): Route => {
    const prices = [
      { date: new Date(today), price: basePrice },
      { date: new Date(nextWeek), price: Math.round(basePrice * 1.1) }
    ];
    
    return {
      id,
      from,
      to,
      basePrice,
      distance,
      duration,
      prices,
      meta: {
        fromCode,
        toCode,
        source: 'fallback',
        lowestPrice: Math.round(basePrice * 0.9),
        highestPrice: Math.round(basePrice * 1.3)
      }
    };
  };

  // Generate some sample routes with realistic data
  const fallbackRoutes: Route[] = [
    createRoute(
      'fallback-1',
      'New York',
      'London',
      650,
      'JFK',
      'LHR',
      '5,567 km',
      '7h 10m'
    ),
    createRoute(
      'fallback-2',
      'Seattle',
      'Detroit',
      350,
      'SEA',
      'DTW',
      '3,300 km',
      '4h 15m'
    ),
    createRoute(
      'fallback-3',
      'Grand Rapids',
      'Los Angeles',
      420,
      'GRR',
      'LAX',
      '3,100 km',
      '4h 45m'
    ),
    createRoute(
      'fallback-4',
      'San Francisco',
      'New York',
      380,
      'SFO',
      'JFK',
      '4,130 km',
      '5h 30m'
    ),
    createRoute(
      'fallback-5',
      'Las Vegas',
      'Austin',
      290,
      'LAS',
      'AUS',
      '1,760 km',
      '2h 55m'
    ),
    createRoute(
      'fallback-6',
      'Vienna',
      'New York',
      780,
      'VIE',
      'JFK',
      '6,900 km',
      '9h 15m'
    )
  ];

  console.log(`Generated ${fallbackRoutes.length} fallback routes`);
  return fallbackRoutes;
};

// Helper function to generate mock price data for one-day flights starting from today
export const generateMockPrices = (basePrice: number = 550): FlightPrice[] => {
  const prices: FlightPrice[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  // Generate prices for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Calculate price factors
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base price variation (±15%)
    const baseVariation = 0.85 + (Math.random() * 0.3);
    
    // Weekend premium (20% more expensive on weekends)
    const weekendMultiplier = isWeekend ? 1.2 : 1.0;
    
    // Price increases as departure approaches (2% per day)
    const advanceMultiplier = 1 + ((6 - i) * 0.02);
    
    // Calculate final price with all factors
    let finalPrice = Math.round(basePrice * baseVariation * weekendMultiplier * advanceMultiplier);
    
    // Add some random fluctuation
    const randomVariation = Math.round((Math.random() * 80) - 40); // -40 to +40
    finalPrice += randomVariation;
    
    // Ensure price is reasonable (at least $50)
    finalPrice = Math.max(50, finalPrice);
    
    prices.push({
      date,
      price: finalPrice
    });
  }
  
  return prices;
};
