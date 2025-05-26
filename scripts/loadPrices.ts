import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './loadEnv';
import { ensureSnapshotsDir, savePriceSnapshot, aggregatePrices } from '../src/utils/snapshotUtils';
import { getAndSaveFlightPrices } from './amadeusServiceDirect';
import { getRoutes } from './routeServiceDirect';

// Load environment variables
loadEnv();

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure snapshots directory exists
ensureSnapshotsDir();

// Log environment variables (for debugging)
console.log('Environment variables loaded:', {
  AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ? '***' : 'Not found',
  AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ? '***' : 'Not found',
  AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME || 'Not found',
  DB_USER: process.env.DB_USER || 'Not found',
  DB_HOST: process.env.DB_HOST || 'Not found',
  DB_NAME: process.env.DB_NAME || 'Not found',
  NODE_ENV: process.env.NODE_ENV || 'development'
});

// For testing, only load 14 days of data
const days = process.argv[2] ? parseInt(process.argv[2], 10) : 14;
console.log(`Loading prices for ${days} days for testing...`);

async function loadPricesForAllRoutes(days: number) {
  try {
    console.log(`Loading prices for the next ${days} days for all routes...`);
    
    // Get all routes
    const routes = await getRoutes();
    
    if (!routes || routes.length === 0) {
      console.log('No routes found in the database');
      return [];
    }
    
    console.log(`Found ${routes.length} routes to update`);
    
    const allPrices: any[] = [];
    
    // Process each route
    for (const route of routes) {
      try {
        console.log(`\n=== Processing route: ${route.origin} to ${route.destination} ===`);
        
        // Get prices for the specified number of days
        const prices = await getAndSaveFlightPrices(
          route.origin,
          route.destination,
          new Date(),
          days
        );
        
        allPrices.push(...prices);
        
        console.log(`✅ Loaded ${prices.length} price points for ${route.origin} to ${route.destination}`);
        
        // Add a small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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

// Execute the function
loadPricesForAllRoutes(days)
  .then(async (prices: any[]) => {
    if (!prices || prices.length === 0) {
      console.log('No prices to save');
      return;
    }

    console.log('Saving price snapshot...');
    const snapshotFile = await savePriceSnapshot(prices);
    console.log(`Price snapshot saved to: ${snapshotFile}`);
    
    // Generate aggregated data for the UI
    const aggregated = aggregatePrices(prices);
    const aggregatedFile = path.join(path.dirname(snapshotFile), 'aggregated_prices.json');
    await fs.promises.writeFile(aggregatedFile, JSON.stringify(aggregated, null, 2));
    console.log(`Aggregated data saved to: ${aggregatedFile}`);
    
    console.log('Price loading completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error loading prices:', error);
    process.exit(1);
  });
