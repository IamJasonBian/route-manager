import Amadeus from 'amadeus';

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

      // Extract the price and flight details from the response
      if (response.data && response.data.length > 0) {
        const flight = response.data[0];
        const price = parseFloat(flight.price.total);

        // Extract flight details
        const firstSegment = flight.itineraries[0].segments[0];
        const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];

        return {
          date,
          price,
          flightDetails: {
            carrier: firstSegment.carrierCode,
            flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
            departureTime: firstSegment.departure.at,
            arrivalTime: lastSegment.arrival.at,
            duration: flight.itineraries[0].duration,
            stops: flight.itineraries[0].segments.length - 1,
            bookingClass: flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY'
          }
        };
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

export const handler = async (event, context) => {
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

  // Debug: Log environment variables (excluding sensitive ones)
  console.log('Environment variables:', {
    AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ? '***' : 'Not set',
    AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ? '***' : 'Not set',
    AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
  });

  // Set CORS headers - allow both localhost and production
  const origin = event.headers.origin || event.headers.Origin || '';
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://apollo-route-manager.windsurf.build',
    'https://route-manager-demo.netlify.app'
  ];

  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[2],
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
      const carriers = ['AA', 'DL', 'UA', 'BA', 'AF'];
      const mockPrices = dates.map((date, index) => {
        const randomVariation = Math.random() * 100 - 50;
        const carrier = carriers[index % carriers.length];
        const flightNum = Math.floor(1000 + Math.random() * 9000);

        return {
          date,
          price: Math.round(basePrice + randomVariation),
          flightDetails: {
            carrier: carrier,
            flightNumber: `${carrier}${flightNum}`,
            departureTime: `${date}T08:00:00`,
            arrivalTime: `${date}T16:30:00`,
            duration: 'PT8H30M',
            stops: Math.floor(Math.random() * 2),
            bookingClass: 'ECONOMY'
          }
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
        prices,
        basePrice,
        lowestPrice,
        highestPrice,
        source: 'amadeus'
      })
    };
    
  } catch (error) {
    console.error('Error in flight-prices function:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error fetching flight prices',
        message: error.message
      })
    };
  }
};
