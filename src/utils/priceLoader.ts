import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from the root .env file
const envPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: envPath });

import { getAndSaveFlightPrices } from '../services/amadeusService';
import { getRoutes } from '../services/routeService';
import { FlightPrice, FlightPriceResult } from '../types/flight';

/**
 * Loads one month of prices for all routes in the database
 * @param days Number of days to load prices for (default: 14)
 */
export async function loadPricesForAllRoutes(days: number = 14): Promise<FlightPriceResult[]> {
  try {
    console.log(`Loading prices for the next ${days} days for all routes...`);
    
    // Get all routes from the database
    const routes = await getRoutes();
    
    if (routes.length === 0) {
      console.warn('No routes found in the database. Please add routes first.');
      return [];
    }
    
    console.log(`Found ${routes.length} routes to update`);
    
    const allPrices: FlightPriceResult[] = [];
    
    // Process each route
    for (const route of routes) {
      try {
        console.log(`\n=== Processing route: ${route.origin} to ${route.destination} ===`);
        
        // Get prices for the specified number of days
        const prices: FlightPrice[] = await getAndSaveFlightPrices(
          route.origin,
          route.destination,
          new Date(),
          days
        );
        
        // Convert FlightPrice to FlightPriceResult (Date to ISO string)
        const priceResults: FlightPriceResult[] = prices.map(price => ({
          origin: price.origin,
          destination: price.destination,
          departureDate: price.departureDate.toISOString(),
          price: price.price,
          currency: price.currency,
          flightNumber: price.flightNumber
        }));
        
        allPrices.push(...priceResults);
        
        console.log(`✅ Loaded ${prices.length} price points for ${route.origin} to ${route.destination}`);
        
        // Add a delay between processing routes to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing route ${route.origin} to ${route.destination}:`, error);
      }
    }
    
    console.log(`\nLoaded ${allPrices.length} price points in total`);
    return allPrices;
    
  } catch (error) {
    console.error('Error in loadPricesForAllRoutes:', error);
    throw error;
  }
}

// This file is meant to be imported by loadPrices.ts
