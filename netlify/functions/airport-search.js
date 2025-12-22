import Amadeus from 'amadeus';
import config from '../../src/config/env.js';

// Initialize Amadeus client with config
const amadeus = new Amadeus({
  clientId: config.amadeus.apiKey,
  clientSecret: config.amadeus.apiSecret,
  hostname: config.amadeus.hostname
});

export const handler = async (event, context) => {
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
    const { keyword } = params;

    // Validate required parameters
    if (!keyword || keyword.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Keyword must be at least 2 characters' })
      };
    }

    console.log(`Searching airports for keyword: ${keyword}`);

    // Search for airports using Amadeus API
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: 'AIRPORT,CITY',
      'page[limit]': 10
    });

    // Transform the response to a simpler format
    const airports = response.data.map(location => ({
      iataCode: location.iataCode,
      name: location.name,
      cityName: location.address?.cityName || '',
      countryName: location.address?.countryName || '',
      type: location.subType
    }));

    console.log(`Found ${airports.length} airports for keyword: ${keyword}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        airports,
        source: 'amadeus'
      })
    };

  } catch (error) {
    console.error('Error in airport-search function:', error);

    // Return fallback airports if API fails
    const keyword = event.queryStringParameters?.keyword || '';
    const fallbackAirports = getFallbackAirports(keyword);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        airports: fallbackAirports,
        source: 'fallback'
      })
    };
  }
};

// Fallback airport data when Amadeus API is unavailable
const getFallbackAirports = (keyword) => {
  const allAirports = [
    { iataCode: 'JFK', name: 'John F. Kennedy International Airport', cityName: 'New York', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'LHR', name: 'London Heathrow Airport', cityName: 'London', countryName: 'United Kingdom', type: 'AIRPORT' },
    { iataCode: 'LAX', name: 'Los Angeles International Airport', cityName: 'Los Angeles', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'ORD', name: "Chicago O'Hare International Airport", cityName: 'Chicago', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'SFO', name: 'San Francisco International Airport', cityName: 'San Francisco', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'CDG', name: 'Paris Charles de Gaulle Airport', cityName: 'Paris', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'NRT', name: 'Narita International Airport', cityName: 'Tokyo', countryName: 'Japan', type: 'AIRPORT' },
    { iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', cityName: 'Sydney', countryName: 'Australia', type: 'AIRPORT' },
    { iataCode: 'DXB', name: 'Dubai International Airport', cityName: 'Dubai', countryName: 'United Arab Emirates', type: 'AIRPORT' },
    { iataCode: 'SIN', name: 'Singapore Changi Airport', cityName: 'Singapore', countryName: 'Singapore', type: 'AIRPORT' },
    { iataCode: 'HKG', name: 'Hong Kong International Airport', cityName: 'Hong Kong', countryName: 'Hong Kong', type: 'AIRPORT' },
    { iataCode: 'MIA', name: 'Miami International Airport', cityName: 'Miami', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'SEA', name: 'Seattle-Tacoma International Airport', cityName: 'Seattle', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'BOS', name: 'Boston Logan International Airport', cityName: 'Boston', countryName: 'United States', type: 'AIRPORT' },
    { iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', cityName: 'Atlanta', countryName: 'United States', type: 'AIRPORT' },
  ];

  const lowerKeyword = keyword.toLowerCase();
  return allAirports.filter(airport =>
    airport.iataCode.toLowerCase().includes(lowerKeyword) ||
    airport.name.toLowerCase().includes(lowerKeyword) ||
    airport.cityName.toLowerCase().includes(lowerKeyword)
  ).slice(0, 10);
};
