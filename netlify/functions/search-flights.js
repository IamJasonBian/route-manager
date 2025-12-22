import Amadeus from 'amadeus';

// Initialize Amadeus client (will be lazy-loaded on first request)
let amadeus;

export const handler = async (event, context) => {
  console.log('=== New Request ===');
  console.log('Method:', event.httpMethod);
  console.log('Path:', event.path);
  console.log('Query:', event.queryStringParameters);

  // Set CORS headers - use environment variable or allow all origins
  const allowedOrigin = process.env.CORS_ORIGIN || '*';
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    const error = { error: 'Method Not Allowed', allowed: ['POST'] };
    console.error('Method not allowed:', error);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify(error),
    };
  }

  try {
    // Initialize Amadeus client if not already initialized
    if (!amadeus) {
      console.log('Initializing Amadeus client...');
      amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET,
        hostname: process.env.AMADEUS_HOSTNAME || 'production'
      });
      console.log('Amadeus client initialized successfully');
    }

    // Parse request body
    let params;
    try {
      params = JSON.parse(event.body || '{}');
      console.log('Parsed request body:', params);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON in request body',
          message: parseError.message
        })
      };
    }
    
    // Validate required parameters
    if (!params.origin || !params.destination || !params.departureDate) {
      console.error('Validation error: Missing required parameters', {
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate
      });
      return {
        statusCode: 400,
        headers,
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
      headers,
      body: JSON.stringify({
        data: response.data || [],
        meta: response.meta || {}
      })
    };
  } catch (error) {
    console.error('Amadeus API error:', error);
    
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
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch flight data',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        message: error.description || error.message
      })
    };
  }
};
