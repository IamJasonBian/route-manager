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

// Now import the function after environment variables are loaded
const { loadPricesForAllRoutes } = await import('../src/utils/priceLoader.js');

// For testing, only load 14 days of data
const days = process.argv[2] ? parseInt(process.argv[2], 10) : 14;
console.log(`Loading prices for ${days} days for testing...`);

// Execute the function
loadPricesForAllRoutes(days)
  .then(() => {
    console.log('Price loading completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error loading prices:', error);
    process.exit(1);
  });
