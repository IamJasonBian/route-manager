import axios from 'axios';
import { writeFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Amadeus API configuration
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const isProduction = process.env.AMADEUS_HOSTNAME === 'production';
const AMADEUS_TOKEN_URL = isProduction 
  ? 'https://api.amadeus.com/v1/security/oauth2/token'
  : 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_API_BASE = isProduction
  ? 'https://api.amadeus.com/v2'
  : 'https://test.api.amadeus.com/v2';

// Types
interface Route {
  from: string;
  to: string;
  fromName: string;
  toName: string;
}

interface PricePoint {
  date: Date;
  price: number;
}

interface FlightOffer {
  price: {
    total: string;
  };
  // Add other relevant fields from the Amadeus API response
}

// Routes to check (origin, destination)
const ROUTES: Route[] = [
  { from: 'JFK', to: 'LHR', fromName: 'New York (JFK)', toName: 'London (LHR)' },
  { from: 'JFK', to: 'SEA', fromName: 'New York (JFK)', toName: 'Seattle (SEA)' },
  { from: 'JFK', to: 'DTW', fromName: 'New York (JFK)', toName: 'Detroit (DTW)' },
  { from: 'JFK', to: 'GRR', fromName: 'New York (JFK)', toName: 'Grand Rapids (GRR)' },
  { from: 'JFK', to: 'LAX', fromName: 'New York (JFK)', toName: 'Los Angeles (LAX)' },
  { from: 'JFK', to: 'SFO', fromName: 'New York (JFK)', toName: 'San Francisco (SFO)' },
  { from: 'JFK', to: 'LAS', fromName: 'New York (JFK)', toName: 'Las Vegas (LAS)' },
  { from: 'JFK', to: 'VIE', fromName: 'New York (JFK)', toName: 'Vienna (VIE)' },
];

// Get Amadeus API access token
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', AMADEUS_API_KEY!);
  params.append('client_secret', AMADEUS_API_SECRET!);

  const response = await axios.post(AMADEUS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.access_token;
}

// Get flight offers for a specific route
async function getFlightOffers(accessToken: string, origin: string, destination: string, departureDate: string): Promise<FlightOffer | null> {
  try {
    const response = await axios.get(`${AMADEUS_API_BASE}/shopping/flight-offers`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        adults: 1,
        currencyCode: 'USD',
        max: 1 // Get only the cheapest option
      }
    });
    return response.data.data?.[0];
  } catch (error) {
    console.error(`Error fetching flight offers for ${origin}-${destination} on ${departureDate}:`, error.response?.data || error.message);
    return null;
  }
}

// Calculate dates for the next 4 months
function getNextFourMonthsDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 4; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() + i);
    
    // Set to the 15th of each month for better pricing
    date.setDate(15);
    
    // Format as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    if (formattedDate) {
      dates.push(formattedDate);
    }
  }
  
  return dates;
}

// Get distance between two airports using Great Circle Distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Estimate flight duration based on distance
function estimateDuration(distance: number) {
  // Base time + 1 hour for every 500 miles + 30 minutes for takeoff/landing
  const hours = Math.round((distance / 500) * 10) / 10 + 0.5;
  const hourPart = Math.floor(hours);
  const minutePart = Math.round((hours % 1) * 60);
  return `${hourPart}h ${minutePart}m`;
}

// Define the route data type that matches our default routes structure
interface RouteData {
  from: string;
  to: string;
  basePrice: number;
  prices: Array<{ date: Date; price: number }>;
  distance: string;
  duration: string;
  meta: {
    fromCode: string;
    toCode: string;
    source: string;
    lowestPrice: number;
    highestPrice: number;
    updatedAt: string;
  };
}

// Main function to fetch all routes
async function fetchAllRoutes() {
  const accessToken = await getAccessToken();
  const dates = getNextFourMonthsDates();
  
  const routes: RouteData[] = [];
  
  for (const route of ROUTES) {
    console.log(`Fetching data for ${route.fromName} → ${route.toName}...`);
    const prices: Array<{ date: Date; price: number }> = [];
    
    for (const date of dates) {
      const flight = await getFlightOffers(accessToken, route.from, route.to, date);
      
      if (flight) {
        const price = parseFloat(flight.price.total);
        if (!isNaN(price)) {
          prices.push({
            date: new Date(date),
            price: price
          });
        }
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (prices.length > 0) {
          // Calculate distance using approximate coordinates (in a real app, you'd use an airport database)
      const destinationLat = route.to === 'LHR' ? 51.4700 :  // Approximate coordinates for destinations
        route.to === 'SEA' ? 47.4502 :
        route.to === 'DTW' ? 42.2124 :
        route.to === 'GRR' ? 42.8808 :
        route.to === 'LAX' ? 33.9416 :
        route.to === 'SFO' ? 37.6213 :
        route.to === 'LAS' ? 36.0840 :
        48.1106;  // VIE
        
      const destinationLon = route.to === 'LHR' ? -0.4563 :
        route.to === 'SEA' ? -122.3088 :
        route.to === 'DTW' ? -83.3534 :
        route.to === 'GRR' ? -85.5228 :
        route.to === 'LAX' ? -118.4085 :
        route.to === 'SFO' ? -122.3790 :
        route.to === 'LAS' ? -115.1537 :
        16.5695;   // VIE
        
      const distance = calculateDistance(
        40.6413, -73.7781, // JFK coordinates
        destinationLat,
        destinationLon
      );
      
      const duration = estimateDuration(distance);
      const priceValues = prices.map(p => p.price);
      const basePrice = Math.min(...priceValues);
      const lowestPrice = Math.min(...priceValues);
      const highestPrice = Math.max(...priceValues);
      
      const routeData: RouteData = {
        from: route.fromName,
        to: route.toName,
        basePrice,
        prices: [...prices], // Create a copy of the prices array
        distance: `${distance.toLocaleString()} mi`,
        duration,
        meta: {
          fromCode: route.from,
          toCode: route.to,
          source: 'amadeus',
          lowestPrice,
          highestPrice,
          updatedAt: new Date().toISOString()
        }
      };
      
      routes.push(routeData);
    }
  }
  
  // Map routes to RouteData type
  const routeData: RouteData[] = routes.map(route => {
    // Ensure prices are in the correct format
    const prices = route.prices.map(p => ({
      date: typeof p.date === 'string' ? new Date(p.date) : p.date,
      price: p.price
    }));
    
    // Calculate base price if not provided
    const basePrice = route.basePrice || Math.round(
      prices.reduce((sum, p) => sum + p.price, 0) / prices.length
    );
    
    // Create route data object
    return {
      from: route.from,
      to: route.to,
      basePrice,
      prices,
      distance: route.distance || '0 mi',
      duration: route.duration || '0h 0m',
      meta: {
        fromCode: route.from,
        toCode: route.to,
        source: 'default',
        lowestPrice: Math.min(...prices.map(p => p.price)),
        highestPrice: Math.max(...prices.map(p => p.price)),
        updatedAt: new Date().toISOString()
      }
    };
  });
  
  return routeData;
}

// Run the script
async function main() {
  try {
    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
      throw new Error('Missing AMADEUS_API_KEY or AMADEUS_API_SECRET in .env');
    }
    
    console.log('Fetching flight data...');
    const routes = await fetchAllRoutes();
    
    // Save to defaultRoutes.ts
    const content = `import { ApiRoute } from '../src/services/api';

// This file is auto-generated. Run 'npm run fetch-default-routes' to update.
// Last updated: ${new Date().toISOString()}

export const defaultRoutes: Omit<ApiRoute, 'id'>[] = ${JSON.stringify(routes, null, 2)};`;
    
    writeFileSync('./src/config/defaultRoutes.ts', content);
    console.log('Successfully updated default routes!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
