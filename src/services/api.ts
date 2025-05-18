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

// Get available routes with enhanced error handling and logging
export const getRoutes = async (): Promise<Route[]> => {
  try {
    console.log('[API] Fetching routes...');
    
    // Call our Netlify function to get popular routes
    const response = await apiClient.get('/popular-routes');
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected an array');
    }

    console.log(`[API] Received ${response.data.length} routes`);
    
    // Process and validate each route
    const processedData = await Promise.all(
      response.data.map(async (route: any, index: number) => {
        const routeId = `route-${index}`;
        
        try {
          // Log the raw route data for debugging
          console.log(`[API] Raw route data for ${routeId}:`, JSON.stringify(route, null, 2));
          
          // Extract city names and airport codes
          const fromCity = route.from || 'Unknown Origin';
          const toCity = route.to || 'Unknown Destination';
          const fromCode = route.code1 || '';
          const toCode = route.code2 || '';
          
          console.log(`[API] Processing ${routeId}: ${fromCity} (${fromCode}) to ${toCity} (${toCode})`);
          
          if (!route.prices || !Array.isArray(route.prices)) {
            console.warn(`[API] ${routeId}: Missing or invalid prices array`);
            throw new Error('Invalid prices data');
          }

          // Process prices with validation
          const prices = route.prices.map((price: any, priceIndex: number) => {
            const date = new Date(price.date);
            if (isNaN(date.getTime())) {
              console.warn(`[API] ${routeId}: Invalid date at index ${priceIndex}:`, price.date);
              throw new Error(`Invalid date format at index ${priceIndex}`);
            }
            
            const priceValue = Number(price.price);
            if (isNaN(priceValue)) {
              console.warn(`[API] ${routeId}: Invalid price at index ${priceIndex}:`, price.price);
              throw new Error(`Invalid price at index ${priceIndex}`);
            }
            
            return { date, price: priceValue };
          });

          const processedRoute: Route = {
            id: route.id || `generated-${Date.now()}-${index}`,
            from: fromCity,
            to: toCity,
            basePrice: Number(route.basePrice) || 0,
            prices,
            distance: route.distance || 'Unknown',
            duration: route.duration || 'Unknown',
            // Include additional data that might be useful
            meta: {
              fromCode,
              toCode,
              source: route.source || 'unknown',
              lowestPrice: route.lowestPrice,
              highestPrice: route.highestPrice
            }
          };

          if (!isValidRoute(processedRoute)) {
            console.warn(`[API] ${routeId}: Failed route validation`, processedRoute);
            throw new Error('Route validation failed');
          }

          console.log(`[API] Successfully processed ${routeId}`);
          return processedRoute;
          
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[API] Error processing ${routeId}:`, error);
          // Generate a mock route if processing fails
          return {
            id: `fallback-${Date.now()}-${index}`,
            from: route.from || 'Unknown',
            to: route.to || 'Unknown',
            basePrice: 500 + (Math.random() * 500),
            prices: generateMockPrices(500 + (Math.random() * 500)),
            distance: route.distance || 'Unknown',
            duration: route.duration || 'Unknown',
            meta: {
              fromCode: route.code1 || '',
              toCode: route.code2 || '',
              source: 'fallback',
              _error: `Failed to process: ${errorMessage}`
            }
          };
        }
      })
    );

    // Filter out any invalid routes that might have slipped through
    const validRoutes = processedData.filter(route => 
      route && 
      route.prices && 
      route.prices.length > 0 &&
      !('_error' in route)
    );

    if (validRoutes.length === 0) {
      console.warn('[API] No valid routes found, falling back to mock data');
      return generateFallbackRoutes();
    }

    console.log(`[API] Successfully processed ${validRoutes.length} valid routes`);
    return validRoutes;
    
  } catch (error) {
    console.error('[API] Error in getRoutes:', error);
    console.warn('[API] Falling back to mock route data');
    return generateFallbackRoutes();
  }
};

// Generate fallback routes when API fails
const generateFallbackRoutes = (): Route[] => {
  const routes: Route[] = [
    {
      id: 'fallback-1',
      from: 'New York',
      to: 'London',
      basePrice: 550,
      prices: generateMockPrices(550),
      distance: '3,461 miles',
      duration: '7h 25m',
      meta: {
        fromCode: 'JFK',
        toCode: 'LHR',
        source: 'fallback',
        lowestPrice: 450,
        highestPrice: 800
      }
    },
    {
      id: 'fallback-2',
      from: 'New York',
      to: 'Seattle',
      basePrice: 450,
      prices: generateMockPrices(450),
      distance: '2,421 miles',
      duration: '6h 10m',
      meta: {
        fromCode: 'JFK',
        toCode: 'SEA',
        source: 'fallback',
        lowestPrice: 350,
        highestPrice: 650
      }
    }
  ];
  
  console.log('[API] Generated fallback routes');
  return routes;
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
