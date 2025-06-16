import Amadeus from 'amadeus';
import { withCors } from './utils/cors';

// Try to get config from environment variables first (for Netlify)
const getConfig = () => {
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    return {
      apiKey: process.env.AMADEUS_API_KEY,
      apiSecret: process.env.AMADEUS_API_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME || 'production'
    };
  }
  
  // Fallback to config import (for local development)
  try {
    const config = require('../../src/config/env.js');
    return {
      apiKey: config.default.amadeus.apiKey,
      apiSecret: config.default.amadeus.apiSecret,
      hostname: config.default.amadeus.hostname
    };
  } catch (error) {
    console.error('Failed to load config:', error);
    throw new Error('Failed to load configuration');
  }
};

const config = getConfig();

// Initialize Amadeus client with config
const amadeus = new Amadeus({
  clientId: config.apiKey,
  clientSecret: config.apiSecret,
  hostname: config.hostname
});

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper function to generate dates for the next 30 days
const generateDatesForNextMonth = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

// Function to get flight prices for multiple dates
const getFlightPricesForDates = async (origin, destination, dates) => {
  const pricePromises = dates.map(async (date) => {
    try {
      // Search for flight offers
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: '1',
        max: '1', // Only get the cheapest offer
        currencyCode: 'USD'
      });
      
      // Log the raw Amadeus API response
      console.log(`Amadeus API response for ${origin} to ${destination} on ${date}:`, JSON.stringify(response, null, 2));
      
      // Extract the price from the response
      if (response.data && response.data.length > 0) {
        const price = parseFloat(response.data[0].price.total);
        return { date, price };
      }
      
      // If no offers found, return null
      return { date, price: null };
    } catch (error) {
      console.error(`Error fetching price for ${date}:`, error);
      return { date, price: null };
    }
  });
  
  // Wait for all price requests to complete
  const prices = await Promise.all(pricePromises);
  
  // Filter out null prices and return the results
  return prices.filter(price => price.price !== null);
};

const flightPricesHandler = async (event, context) => {
  // Debug: Log environment variables (excluding sensitive ones)
  console.log('Environment variables:', {
    AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ? '***' : 'Not set',
    AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ? '***' : 'Not set',
    AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
  });

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    // Parse request parameters
    const params = event.queryStringParameters || {};
    const { from, to } = params;
    
    // Validate required parameters
    if (!from || !to) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters: from and to' })
      };
    }
    
    // Convert city names to IATA codes if needed
    // This is a simplified example - in a real app, you'd use the Amadeus Airport & City Search API
    const cityToCode = {
      'New York': 'JFK',
      'London': 'LHR',
      'Seattle': 'SEA',
      'Detroit': 'DTW',
      'Grand Rapids': 'GRR',
      'Los Angeles': 'LAX',
      'San Francisco': 'SFO',
      'Las Vegas': 'LAS',
      'Austin': 'AUS',
      'Vienna': 'VIE'
    };
    
    const originCode = cityToCode[from] || from;
    const destinationCode = cityToCode[to] || to;
    
    // Generate dates for the next 30 days
    const dates = generateDatesForNextMonth();
    
    // Get flight prices for all dates
    const prices = await getFlightPricesForDates(originCode, destinationCode, dates);
    
    // If no prices found, return an error
    if (prices.length === 0) {
      console.log('No prices found, falling back to mock data');
      // Generate mock data as fallback
      const basePrice = 500 + Math.random() * 200;
      const mockPrices = dates.map(date => {
        const randomVariation = Math.random() * 100 - 50;
        return {
          date,
          price: Math.round(basePrice + randomVariation)
        };
      });
      
      // Log the mock fallback data
      console.log(`Mock fallback data for ${origin} to ${destination}:`, JSON.stringify(mockPrices, null, 2));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          prices: mockPrices,
          source: 'mock'
        })
      };
    }
    
    // Calculate statistics
    const priceValues = prices.map(p => p.price);
    const basePrice = Math.round(priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length);
    const lowestPrice = Math.min(...priceValues);
    const highestPrice = Math.max(...priceValues);
    
    // Return the results
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Flight prices retrieved successfully',
        data: {
          origin: originCode,
          destination: destinationCode,
          prices: prices.filter(Boolean)
        }
      })
    };
    
  } catch (error) {
    console.error('Error in flight-prices function:', error);
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch flight prices',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
      })
    };
  }
};

// Export the handler with CORS support
export const handler = withCors(flightPricesHandler);
