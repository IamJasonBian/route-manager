import axios from 'axios';

// Note: Google Flights API (QPX Express) was discontinued in 2018
// We'll use Duffel API as an alternative (https://duffel.com/)
// You would need to sign up for an API key at https://duffel.com/

// API configuration
const DUFFEL_API_KEY = 'duffel_test_Az2Sn9PHnhabv91W5eT7huFSR0LSIc9Pi4V8roBv4NE'; // Replace with your actual API key

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: 'https://api.duffel.com/air',
  headers: {
    'Authorization': `Bearer ${DUFFEL_API_KEY}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Duffel-Version': 'v1'
  }
});

// Interface for flight price data
export interface FlightPrice {
  date: Date;
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
    
    // CORS Issue: Direct API calls to Duffel from the browser are blocked by CORS policy
    // In a production app, you would need to:
    // 1. Create a backend proxy server to make these API calls
    // 2. Use a serverless function (e.g., AWS Lambda, Netlify Functions)
    // 3. Use a CORS proxy for development
    
    // For now, we'll use mock data with some randomization based on the route
    console.warn('Using mock data due to CORS restrictions. In production, use a backend proxy.');
    
    // Generate mock prices with some variation based on the route and date
    const routeHash = from.charCodeAt(0) + to.charCodeAt(0);
    const basePrice = 400 + (routeHash % 500); // Generate a base price between 400-900 based on route
    
    return generateMockPrices(basePrice);
  } catch (error) {
    console.error('Error fetching flight prices:', error);
    // Fall back to mock data on error
    return generateMockPrices();
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
    
    // CORS Issue: Direct API calls to Duffel from the browser are blocked by CORS policy
    // Using mock data with popular routes instead
    
    // Define popular routes with city names and IATA codes for reference
    const popularRoutes = [
      { id: '1', from: 'New York', to: 'London', code1: 'JFK', code2: 'LHR', distance: '3,461 miles', duration: '7h 25m', basePrice: 550 },
      { id: '2', from: 'San Francisco', to: 'Tokyo', code1: 'SFO', code2: 'NRT', distance: '5,124 miles', duration: '11h 15m', basePrice: 750 },
      { id: '3', from: 'Los Angeles', to: 'Paris', code1: 'LAX', code2: 'CDG', distance: '5,677 miles', duration: '10h 30m', basePrice: 650 },
      { id: '4', from: 'Chicago', to: 'Rome', code1: 'ORD', code2: 'FCO', distance: '4,825 miles', duration: '9h 45m', basePrice: 680 },
      { id: '5', from: 'Miami', to: 'Barcelona', code1: 'MIA', code2: 'BCN', distance: '4,690 miles', duration: '9h 10m', basePrice: 620 },
      { id: '6', from: 'Boston', to: 'Dublin', code1: 'BOS', code2: 'DUB', distance: '3,130 miles', duration: '6h 20m', basePrice: 480 }
    ];
    
    // Generate price variations for each route
    return popularRoutes.map(route => {
      // Generate prices with some variation based on the route
      const routeHash = route.code1.charCodeAt(0) + route.code2.charCodeAt(0);
      const basePrice = route.basePrice + (routeHash % 50); // Small variation based on route codes
      
      return {
        id: route.id,
        from: route.from,
        to: route.to,
        basePrice,
        prices: generateMockPrices(basePrice),
        distance: route.distance,
        duration: route.duration
      };
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    
    // Fallback to minimal mock data if everything fails
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
        from: 'San Francisco',
        to: 'Tokyo',
        basePrice: 750,
        prices: generateMockPrices(750),
        distance: '5,124 miles',
        duration: '11h 15m'
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
