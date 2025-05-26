import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Log environment variables (for debugging)
console.log('Environment variables loaded:', {
  AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ? '***' : 'Not found',
  AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ? '***' : 'Not found',
  AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME || 'Not found',
  DB_USER: process.env.DB_USER || 'Not found',
  DB_HOST: process.env.DB_HOST || 'Not found',
  DB_NAME: process.env.DB_NAME || 'Not found',
});

// Import the function after environment variables are loaded
const { getAndSaveFlightPrices } = await import('./amadeusServiceDirect.js');

// Test with a single route (JFK to LHR)
async function testSingleRoute() {
  try {
    console.log('\n=== Testing with JFK to LHR ===');
    const results = await getAndSaveFlightPrices('JFK', 'LHR', new Date(), 2);
    console.log('Results:', results);
    
    if (results.length > 0) {
      console.log('✅ Successfully fetched and saved flight prices');
    } else {
      console.log('ℹ️ No flight prices were found or saved');
    }
  } catch (error) {
    console.error('❌ Error in testSingleRoute:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testSingleRoute();
