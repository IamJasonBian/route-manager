import Amadeus from 'amadeus';
import { withCors } from './utils/cors';

// Helper function to get config with fallbacks
const getConfig = async () => {
  // Try to get from environment variables first (for Netlify)
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    console.log('Using environment variables for Amadeus config');
    return {
      apiKey: process.env.AMADEUS_API_KEY,
      apiSecret: process.env.AMADEUS_API_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME || 'production'
    };
  }
  
  // Fallback to config import (for local development)
  try {
    console.log('Trying to load config from ../../src/config/env.js');
    const config = await import('../../src/config/env.js');
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

// Initialize Amadeus client
let amadeus;

const searchFlightsHandler = async (event, context) => {
  console.log('=== New Request ===');
  console.log('Method:', event.httpMethod);
  console.log('Path:', event.path);
  console.log('Query:', event.queryStringParameters);
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    const error = { error: 'Method Not Allowed', allowed: ['POST'] };
    console.error('Method not allowed:', error);
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error),
    };
  }

  try {
    // Initialize Amadeus client if not already initialized
    if (!amadeus) {
      console.log('Initializing Amadeus client...');
      const config = await getConfig();
      amadeus = new Amadeus({
        clientId: config.apiKey,
        clientSecret: config.apiSecret,
        hostname: config.hostname
      });
      console.log('Amadeus client initialized successfully');
    }

    const params = JSON.parse(event.body);
    
    // Validate required parameters
    if (!params.origin || !params.destination || !params.departureDate) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing required parameters: origin, destination, departureDate' 
        })
      };
    }

    console.log('Searching flights with params:', {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults || 1
    });

    // Make the API call to Amadeus
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      ...(params.returnDate && { returnDate: params.returnDate }),
      adults: params.adults || 1,
      nonStop: params.nonStop || false,
      maxPrice: params.maxPrice,
      max: params.maxResults || 10,
      currencyCode: 'USD',
    });

    console.log('Received response from Amadeus API');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Flight search successful', 
        data: response.data || [],
        meta: response.meta || {}
      })
    };
  } catch (error) {
    console.error('Search flights error:', error);
    
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      code: error.code,
      statusCode: error.response?.statusCode,
      body: error.response?.body,
      description: error.description,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    console.error('Error details:', JSON.stringify(errorDetails, null, 2));
    
    return {
      statusCode: error.response?.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch flight data',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        message: error.description || error.message
      })
    };
  }
};

// Export the handler with CORS support
export const handler = withCors(searchFlightsHandler);
