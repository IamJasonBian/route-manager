import Amadeus from 'amadeus';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Initialize Amadeus client with environment variables
    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_API_KEY,
      clientSecret: process.env.AMADEUS_API_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME || 'production'
    });

    const params = JSON.parse(event.body);
    
    // Validate required parameters
    if (!params.origin || !params.destination || !params.departureDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required parameters: origin, destination, departureDate' 
        }),
      };
    }

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

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: response.data || [],
        meta: response.meta || {}
      }),
    };
  } catch (error) {
    console.error('Amadeus API error:', error);
    
    // Return a more detailed error message
    return {
      statusCode: error.response?.statusCode || 500,
      body: JSON.stringify({
        error: error.description || 'Failed to fetch flight data',
        details: error.response?.body || error.message,
        code: error.code
      }),
    };
  }
};
