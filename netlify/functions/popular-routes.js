const Amadeus = require('amadeus');

// Initialize Amadeus client with production API credentials
const amadeus = new Amadeus({
  clientId: 'eAyYxVTV9z5WIGvJGgrBAnA1L2hLT7kA',
  clientSecret: 'PtEixsoRA9yh1uyO'
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
    const response = await amadeus.shopping.flightOffers.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: 1,  // Required parameter
      nonStop: true,  // Optional: get direct flights only
      max: 1,  // Get only the best offer
      currencyCode: 'USD',
      travelClass: 'ECONOMY',  // Optional: specify travel class
      includedAirlineCodes: '',  // Optional: include specific airlines
      excludedAirlineCodes: ''  // Optional: exclude specific airlines
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

// Function to get flight duration and distance
const getFlightInfo = async (origin, destination) => {
  try {
    console.log(`Fetching flight info for ${origin} to ${destination}`);
    
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
            distance: directFlight.distance ? `${Math.round(directFlight.distance)} miles` : '500 miles'
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
      const flightOffers = await amadeus.shopping.flightOffers.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: formatDate(new Date()),
        adults: 1,
        nonStop: true,
        max: 1,
        currencyCode: 'USD',
        travelClass: 'ECONOMY',
        includedAirlineCodes: '',
        excludedAirlineCodes: ''
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
        return { duration, distance };
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
        distance: `${distance} miles`
      };
    }
    
    // Default return if coordinates not found
    return {
      duration: '1h 30m',
      distance: '500 miles'
    };
  } catch (error) {
    console.error(`Error in getFlightInfo for ${origin} to ${destination}:`, error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    // Return default values in case of any error
    return {
      duration: '1h 30m',
      distance: '500 miles',
      source: 'error-fallback'
    };
  }
};

// Function to generate mock prices for a route
const generateMockPrices = (basePrice = 550) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const prices = [];
  const daysInFourMonths = 120; // Approximately 4 months
  
  // Generate prices for the next 4 months
  for (let i = 0; i < daysInFourMonths; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Generate a more realistic price variation pattern
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    
    // Base variation: cheaper further out, more expensive closer to departure
    // More gradual price increase as departure approaches
    const daysOut = daysInFourMonths - i;
    const timeBasedVariation = -100 + (daysInFourMonths - daysOut) * 2.5;
    
    // Weekend premium (higher for weekends)
    const weekendPremium = isWeekend ? 60 : 0;
    
    // Seasonal adjustment (example: higher in summer and holidays)
    const month = date.getMonth();
    const isPeakSeason = month >= 5 && month <= 7; // June-August
    const seasonalAdjustment = isPeakSeason ? 80 : 0;
    
    // Random fluctuation (reduced for longer time spans)
    const randomVariation = Math.random() * 60 - 30;
    
    // Some days are promotional deals
    const isPromotion = Math.random() < 0.2;
    const promotionDiscount = isPromotion ? -80 - Math.random() * 50 : 0;
    
    // Combine all factors
    const totalVariation = timeBasedVariation + weekendPremium + randomVariation + promotionDiscount + seasonalAdjustment;
    // Ensure price doesn't go below 60% of base price
    const price = Math.max(
      Math.round(basePrice + totalVariation),
      Math.round(basePrice * 0.6)
    );
    
    // Add day of week for reference
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    
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

exports.handler = async (event, context) => {
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
        // Try to get a sample price from Amadeus
        console.log(`Fetching sample price for ${route.code1} to ${route.code2}`);
        let basePrice = await getSamplePrice(route.code1, route.code2);
        let prices;
        let source = 'amadeus';
        
        // If no price found, use mock data
        if (basePrice === null) {
          console.log(`Using mock data for ${route.from} to ${route.to}`);
          basePrice = 450 + Math.floor(Math.random() * 200); // Random base price between 450-650
          prices = generateMockPrices(basePrice);
          source = 'mock';
        } else {
          console.log(`Got price from Amadeus for ${route.from} to ${route.to}: $${basePrice}`);
          // Generate prices based on the base price from Amadeus
          prices = generateMockPrices(basePrice);
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
          duration: flightInfo.duration,
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
