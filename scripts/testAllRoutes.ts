import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Import the function after environment variables are loaded
const { getAndSaveFlightPrices } = await import('./amadeusServiceDirect.js');

// Define test routes with origin and destination IATA codes
const testRoutes = [
  { origin: 'JFK', destination: 'LHR' },  // New York to London
  { origin: 'JFK', destination: 'SEA' },  // New York to Seattle
  { origin: 'JFK', destination: 'SFO' },  // New York to San Francisco
  { origin: 'JFK', destination: 'LAX' },  // New York to Los Angeles
  { origin: 'JFK', destination: 'CDG' },  // New York to Paris
  { origin: 'JFK', destination: 'FRA' },  // New York to Frankfurt
  { origin: 'JFK', destination: 'HND' },  // New York to Tokyo
  { origin: 'JFK', destination: 'SYD' },  // New York to Sydney
  { origin: 'JFK', destination: 'VIE' }   // New York to Vienna
];

// Define result type for better type safety
interface RouteTestResult {
  route: string;
  success: boolean;
  pricesFound?: number;
  price?: number | null;
  currency?: string | null;
  error?: string;
}

// Test all routes
async function testAllRoutes() {
  const results: RouteTestResult[] = [];
  
  for (const route of testRoutes) {
    try {
      console.log(`\n=== Testing ${route.origin} to ${route.destination} ===`);
      
      // Test with just 1 day to minimize API calls
      const prices = await getAndSaveFlightPrices(
        route.origin, 
        route.destination, 
        new Date(), 
        1  // Only fetch for 1 day
      );
      
      const success = prices.length > 0;
      console.log(`✅ ${success ? 'SUCCESS' : 'NO RESULTS'} for ${route.origin}-${route.destination}`);
      
      results.push({
        route: `${route.origin}-${route.destination}`,
        success,
        pricesFound: prices.length,
        price: prices[0]?.price || null,
        currency: prices[0]?.currency || null
      });
      
      // Add a small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ ERROR for ${route.origin}-${route.destination}:`, errorMessage);
      results.push({
        route: `${route.origin}-${route.destination}`,
        success: false,
        error: errorMessage
      });
      
      // Continue with next route even if one fails
      continue;
    }
  }
  
  // Print summary
  console.log('\n=== Test Summary ===');
  console.table(results);
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ ${successCount} of ${testRoutes.length} routes succeeded`);
  
  if (successCount < testRoutes.length) {
    const failedRoutes = results.filter(r => !r.success).map(r => r.route);
    console.log(`❌ Failed routes: ${failedRoutes.join(', ')}`);
  }
  
  return results;
}

// Run the test
async function main() {
  try {
    console.log('Starting route tests...');
    const results = await testAllRoutes();
    
    // Exit with appropriate status code
    const allSucceeded = results.every(r => r.success);
    process.exit(allSucceeded ? 0 : 1);
    
  } catch (error) {
    console.error('Fatal error in test:', error);
    process.exit(1);
  }
}

main();
