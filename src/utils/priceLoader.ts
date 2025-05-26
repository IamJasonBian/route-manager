import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: envPath });

import { getAndSaveFlightPrices } from '../../scripts/amadeusServiceDirect';
import { getRoutes } from '../../scripts/routeServiceDirect';

/**
 * Loads one month of prices for all routes in the database
 * @param days Number of days to load prices for (default: 30)
 */
export const loadPricesForAllRoutes = async (days: number = 30) => {
  try {
    console.log(`Loading prices for the next ${days} days for all routes...`);
    
    // Get all routes from the database
    const routes = await getRoutes();
    
    if (routes.length === 0) {
      console.warn('No routes found in the database. Please add routes first.');
      return [];
    }
    
    console.log(`Found ${routes.length} routes to update`);
    
    const results = [];
    
    // Process each route
    for (const route of routes) {
      try {
        console.log(`\n=== Processing route: ${route.origin} to ${route.destination} ===`);
        
        // Get prices for the specified number of days
        const prices = await getAndSaveFlightPrices(
          route.origin,
          route.destination,
          new Date(), // Start from today
          days
        );
        
        results.push({
          route: `${route.origin} to ${route.destination}`,
          pricesLoaded: prices.length,
          averagePrice: prices.length > 0 
            ? Math.round(prices.reduce((sum, p) => sum + p.price, 0) / prices.length * 100) / 100
            : 0
        });
        
        console.log(`✅ Loaded ${prices.length} price points for ${route.origin} to ${route.destination}`);
        
        // Add a delay between processing routes to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing route ${route.origin} to ${route.destination}:`, error);
        results.push({
          route: `${route.origin} to ${route.destination}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    console.log('\n=== Price loading complete ===');
    console.table(results);
    
    return results;
    
  } catch (error) {
    console.error('Error in loadPricesForAllRoutes:', error);
    throw error;
  }
};

// This file is meant to be imported by loadPrices.ts
