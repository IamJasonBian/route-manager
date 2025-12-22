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

// Function to generate mock prices for a route with realistic patterns
const generateMockPrices = (basePrice = 300) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prices = [];
  const daysInFourMonths = 120; // 4 months of data
  
  // Generate prices for the next 4 months
  for (let i = 0; i < daysInFourMonths; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Only Sat/Sun
    const daysOut = daysInFourMonths - i;
    
    // Base patterns
    const month = date.getMonth();
    const isPeakSeason = month >= 5 && month <= 7; // June-August
    
    // Create a more dynamic price pattern
    // 1. Start with base price
    let price = basePrice;
    
    // 2. Add time-based variation (prices often dip in the middle)
    const timeProgress = i / daysInFourMonths;
    const timeVariation = Math.sin(timeProgress * Math.PI) * 0.3; // Creates a curve
    
    // 3. Add weekend premium (5-15%)
    const weekendPremium = isWeekend ? (0.05 + Math.random() * 0.1) : 0;
    
    // 4. Add peak season adjustment (0-20%)
    const peakAdjustment = isPeakSeason ? Math.random() * 0.2 : 0;
    
    // 5. Add random variation (-15% to +15%)
    const randomVariation = (Math.random() * 0.3) - 0.15;
    
    // Combine all factors
    price = price * (1 + timeVariation + weekendPremium + peakAdjustment + randomVariation);
    
    // Add some noise to make it look more organic
    const noise = (Math.random() - 0.5) * 20; // ±$20
    price = Math.round(price + noise);
    
    // Ensure price stays within reasonable bounds
    price = Math.max(
      Math.round(basePrice * 0.6), 
      Math.min(price, Math.round(basePrice * 1.8))
    );
    
    // Add day of week for reference
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[dayOfWeek];
    
    prices.push({
      date: formatDate(date),
      price,
      day: dayName,
      daysUntil: daysOut,
      isWeekend,
      isPeakSeason
    });
  }
  
  return prices;
};

// Function to get a sample price for a route
const getSamplePrice = async (origin, destination) => {
  try {
    console.log(`Attempting to fetch price for ${origin} to ${destination}`);
    
    // Get a sample price for a date between 2 weeks and 3 months from now
    const minDaysOut = 14; // 2 weeks
    const maxDaysOut = 90; // ~3 months
    const daysOut = Math.floor(Math.random() * (maxDaysOut - minDaysOut + 1)) + minDaysOut;
    
    const sampleDate = new Date();
    sampleDate.setDate(sampleDate.getDate() + daysOut);
    const departureDate = formatDate(sampleDate);
    
    console.log(`Sampling price for ${departureDate} (${daysOut} days out)`);
    
    console.log(`Searching for flights from ${origin} to ${destination} on ${departureDate}`);
    
    // Using the correct API endpoint and parameters according to documentation
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: '1',  // Required parameter, must be string
      nonStop: 'true',  // Get direct flights only, must be string
      max: 1,  // Get only the best offer
      currencyCode: 'USD',
      travelClass: 'ECONOMY'  // Specify travel class
    });
    
    // Log the raw Amadeus API response
    console.log(`Amadeus API response for ${origin} to ${destination} sample price:`, JSON.stringify(response, null, 2));
    
    if (response.data && response.data.length > 0 && response.data[0].price) {
      const price = parseFloat(response.data[0].price.total);
      console.log(`Successfully got price for ${origin} to ${destination}: $${price}`);
      return price;
    } else {
      console.log(`No valid price data found in response for ${origin} to ${destination}`);
    }
    
    console.log(`No flight data available for ${origin} to ${destination}`);
    return null;
  } catch (error) {
    console.error(`Error fetching sample price for ${origin} to ${destination}:`, error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    return null;
  }
};

// Helper function to format ISO 8601 duration (PT6H27M) to readable format (6h 27m)
const formatDuration = (isoDuration) => {
  if (!isoDuration) return 'N/A';
  
  // Extract hours and minutes using regex
  const matches = isoDuration.match(/PT(\d+H)?(\d+M)?/);
  if (!matches) return isoDuration; // Return as is if format doesn't match
  
  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  }
  
  return isoDuration; // Fallback
};

// Function to get flight duration and distance
const getFlightInfo = async (origin, destination) => {
  // First try to get direct flight information from Amadeus
  try {
    console.log(`Trying direct destinations API for ${origin}`);
    const directResponse = await amadeus.airport.directDestinations.get({
      departureAirportCode: origin,
      max: '50' // Get more results to find our specific destination
    });
    
    console.log(`Direct destinations API response for ${origin}:`, 
      JSON.stringify(directResponse, null, 2));
    
    if (directResponse.data && directResponse.data.length > 0) {
      // Try to find the specific destination in the response
      const directFlight = directResponse.data.find(flight => 
        flight.arrivalAirport && flight.arrivalAirport.iataCode === destination
      );
      
      if (directFlight) {
        console.log(`Found direct flight info for ${origin} to ${destination}`);
        return {
          duration: directFlight.duration || '1h 30m',
          distance: directFlight.distance ? `${Math.round(directFlight.distance)} miles` : '500 miles',
          source: 'direct-destinations'
        };
      }
      console.log(`No direct flight info found for ${origin} to ${destination} in direct destinations`);
    }
  } catch (directError) {
    console.error(`Error in direct destinations API for ${origin}:`, directError);
    if (directError.response) {
      console.error('Direct destinations error response:', directError.response.data);
    }
  }
  
  // Fallback to flight offers search for more accurate info
  try {
    console.log(`Trying flight offers search for ${origin} to ${destination}`);
    const flightOffers = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: formatDate(new Date()),
      adults: '1',
      nonStop: 'true',
      max: 1,
      currencyCode: 'USD',
      travelClass: 'ECONOMY'
    });
    
    console.log(`Flight offers search response for ${origin} to ${destination}:`,
      JSON.stringify(flightOffers, null, 2));
    
    if (flightOffers.data && flightOffers.data.length > 0) {
      const offer = flightOffers.data[0];
      const duration = offer.itineraries?.[0]?.duration || '1h 30m';
      
      // Calculate distance from segments if available
      let distance = '500 miles';
      if (offer.itineraries?.[0]?.segments?.[0]?.distance?.value) {
        const meters = offer.itineraries[0].segments[0].distance.value;
        const miles = Math.round(meters * 0.000621371);
        distance = `${miles} miles`;
        console.log(`Calculated distance: ${meters} meters ≈ ${distance}`);
      }
      
      console.log(`Found flight offer with duration: ${duration}, distance: ${distance}`);
      return { 
        duration, 
        distance,
        source: 'flight-offers'
      };
    }
  } catch (offerError) {
    console.error(`Error in flight offers search for ${origin} to ${destination}:`, offerError);
    if (offerError.response) {
      console.error('Flight offers error response:', offerError.response.data);
    }
  }
  
  // Fallback to coordinates-based calculation if API calls fail
  console.log(`Using fallback coordinates-based calculation for ${origin} to ${destination}`);
  
  // Map of airport codes to coordinates (latitude, longitude)
  const airportCoordinates = {
    'JFK': { lat: 40.6413, lng: -73.7781 },
    'LHR': { lat: 51.4700, lng: -0.4543 },
    'SEA': { lat: 47.4502, lng: -122.3088 },
    'DTW': { lat: 42.2162, lng: -83.3554 },
    'GRR': { lat: 42.8808, lng: -85.5228 },
    'LAX': { lat: 33.9416, lng: -118.4085 },
    'SFO': { lat: 37.6213, lng: -122.3790 },
    'LAS': { lat: 36.0840, lng: -115.1537 },
    'AUS': { lat: 30.1975, lng: -97.6664 },
    'VIE': { lat: 48.1103, lng: 16.5697 }
  };
  
  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance);
  };
  
  // Calculate flight duration (rough estimate: 500 mph average speed)
  const calculateDuration = (distance) => {
    const avgSpeedMph = 500;
    const hours = distance / avgSpeedMph;
    const hoursWhole = Math.floor(hours);
    const minutes = Math.round((hours - hoursWhole) * 60);
    return `${hoursWhole}h ${minutes}m`;
  };
  
  if (airportCoordinates[origin] && airportCoordinates[destination]) {
    const distance = calculateDistance(
      airportCoordinates[origin].lat, 
      airportCoordinates[origin].lng,
      airportCoordinates[destination].lat, 
      airportCoordinates[destination].lng
    );
    const duration = calculateDuration(distance);
    
    return {
      duration,
      distance: `${distance} miles`,
      source: 'coordinates-calculation'
    };
  }
  
  // Default return if all else fails
  return {
    duration: '1h 30m',
    distance: '500 miles',
    source: 'default-fallback'
  };
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

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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
    console.log('Received request:', {
      httpMethod: event.httpMethod,
      path: event.path,
      queryStringParameters: event.queryStringParameters,
      headers: event.headers
    });
    
    // Log Amadeus client configuration (without exposing secrets)
    console.log('Amadeus client configured with clientId:', 
      amadeus.client.clientId ? '***' + amadeus.client.clientId.slice(-4) : 'not set');
    
    // Define popular routes with city names and IATA codes
    const popularRoutes = [
      { id: '1', from: 'New York', to: 'London', code1: 'JFK', code2: 'LHR' },
      { id: '2', from: 'New York', to: 'Seattle', code1: 'JFK', code2: 'SEA' },
      { id: '3', from: 'New York', to: 'Detroit', code1: 'JFK', code2: 'DTW' },
      { id: '4', from: 'New York', to: 'Grand Rapids', code1: 'JFK', code2: 'GRR' },
      { id: '5', from: 'New York', to: 'Los Angeles', code1: 'JFK', code2: 'LAX' },
      { id: '6', from: 'New York', to: 'San Francisco', code1: 'JFK', code2: 'SFO' },
      { id: '7', from: 'New York', to: 'Las Vegas', code1: 'JFK', code2: 'LAS' },
      { id: '8', from: 'New York', to: 'Austin', code1: 'JFK', code2: 'AUS' },
      { id: '9', from: 'New York', to: 'Vienna', code1: 'JFK', code2: 'VIE' }
    ];
    
    console.log(`Processing ${popularRoutes.length} routes...`);
    
    // Process each route to add prices and other details
    const routesWithData = await Promise.all(popularRoutes.map(async (route) => {
      const routeStartTime = Date.now();
      console.log(`Processing route ${route.id}: ${route.from} (${route.code1}) to ${route.to} (${route.code2})`);
      
      try {
        let basePrice, prices, source;
        
        // First try to get real flight data
        try {
          console.log(`Fetching real flight data for ${route.code1} to ${route.code2}`);
          const realPrices = await getFlightPricesForDates(route.code1, route.code2, generateDatesForNextMonth());
          
          if (realPrices && realPrices.length > 0) {
            // Sort by price and get the cheapest
            realPrices.sort((a, b) => a.price - b.price);
            basePrice = Math.round(realPrices[0].price); // Round to nearest dollar
            prices = realPrices.map(p => ({
              date: p.date,
              price: Math.round(p.price), // Round all prices
              source: 'amadeus',
              isRealPrice: true
            }));
            source = 'amadeus';
            console.log(`Got ${realPrices.length} real prices from Amadeus for ${route.from} to ${route.to}, best: $${basePrice}`);
          } else {
            throw new Error('No real prices found');
          }
        } catch (error) {
          console.log(`Could not get real flight data for ${route.from} to ${route.to}, using sample price:`, error.message);
          // Fall back to sample price
          const samplePrice = await getSamplePrice(route.code1, route.code2);
          
          if (samplePrice !== null) {
            basePrice = Math.round(samplePrice);
            prices = generateMockPrices(basePrice).map(p => ({
              ...p,
              price: Math.round(p.price), // Round all prices
              source: 'sample',
              isRealPrice: false
            }));
            source = 'sample';
            console.log(`Using sample price for ${route.from} to ${route.to}: $${basePrice}`);
          } else {
            // Last resort: use mock data
            basePrice = 450 + Math.floor(Math.random() * 200);
            prices = generateMockPrices(basePrice).map(p => ({
              ...p,
              price: Math.round(p.price), // Round all prices
              source: 'mock',
              isRealPrice: false
            }));
            source = 'mock';
            console.log(`Using mock data for ${route.from} to ${route.to}: $${basePrice}`);
          }
        }
        
        // Get flight info (duration and distance)
        console.log(`Fetching flight info for ${route.code1} to ${route.code2}`);
        const flightInfo = await getFlightInfo(route.code1, route.code2);
        
        const routeData = {
          id: route.id,
          from: route.from,
          to: route.to,
          basePrice,
          prices,
          distance: flightInfo.distance,
          duration: formatDuration(flightInfo.duration),
          source,
          meta: {
            originCode: route.code1,
            destinationCode: route.code2,
            timestamp: new Date().toISOString()
          }
        };
        
        const processingTime = Date.now() - routeStartTime;
        console.log(`Completed processing route ${route.id} in ${processingTime}ms`);
        
        return routeData;
      } catch (routeError) {
        console.error(`Error processing route ${route.id} (${route.from} to ${route.to}):`, routeError);
        
        // Return a fallback route with mock data
        const fallbackPrice = 500 + Math.floor(Math.random() * 200);
        return {
          id: route.id,
          from: route.from,
          to: route.to,
          basePrice: fallbackPrice,
          prices: generateMockPrices(fallbackPrice),
          distance: '500 miles',
          duration: '1h 30m',
          source: 'error-fallback',
          meta: {
            originCode: route.code1,
            destinationCode: route.code2,
            timestamp: new Date().toISOString(),
            error: 'Failed to fetch route data',
            errorDetails: routeError.message
          }
        };
      }
    }));
    
    // Sort routes by price (lowest first)
    routesWithData.sort((a, b) => a.basePrice - b.basePrice);
    
    console.log(`Successfully processed ${routesWithData.length} routes`);
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'X-Processed-At': new Date().toISOString(),
        'X-Total-Routes': routesWithData.length.toString()
      },
      body: JSON.stringify(routesWithData, null, 2)
    };
  } catch (error) {
    console.error('Critical error in popular-routes handler:', {
      error: error.message,
      stack: error.stack,
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        queryStringParameters: event.queryStringParameters
      }
    });
    
    // Return a meaningful error response
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'X-Error': 'Internal Server Error'
      },
      body: JSON.stringify({
        error: 'Failed to fetch route data',
        message: 'An unexpected error occurred while processing your request',
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};
