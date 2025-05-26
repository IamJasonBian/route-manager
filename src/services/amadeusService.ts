import dotenv from 'dotenv';
import path from 'path';
import Amadeus from 'amadeus';
import { FlightPrice } from './api';
import { saveRoute, DbRoute, getRoutes } from './routeService';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: envPath });

console.log('Amadeus API Key:', process.env.AMADEUS_API_KEY ? '***' : 'Not found');
console.log('Amadeus API Secret:', process.env.AMADEUS_API_SECRET ? '***' : 'Not found');
console.log('Amadeus Hostname:', process.env.AMADEUS_HOSTNAME || 'Not found');

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
  hostname: process.env.AMADEUS_HOSTNAME || 'production' // 'test' or 'production'
});

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  nonStop?: boolean;
  maxPrice?: number;
  maxResults?: number;
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
    }>;
  }>;
}

/**
 * Search for flight offers using Amadeus API
 */
export const searchFlights = async (params: FlightSearchParams): Promise<FlightOffer[]> => {
  try {
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

    return response.data || [];
  } catch (error) {
    console.error('Error searching flights with Amadeus:', error);
    throw error;
  }
};

/**
 * Get flight prices over a date range and save to database
 * @param origin Origin IATA code (e.g., 'JFK')
 * @param destination Destination IATA code (e.g., 'LAX')
 * @param startDate Start date for price checking
 * @param days Number of days to check (default: 30)
 * @returns Array of flight prices with dates
 */
export const getAndSaveFlightPrices = async (
  origin: string,
  destination: string,
  startDate: Date = new Date(),
  days: number = 30
): Promise<FlightPrice[]> => {
  try {
    const prices: FlightPrice[] = [];
    const date = new Date(startDate);
    
    console.log(`Fetching prices from ${origin} to ${destination} for ${days} days starting ${date.toISOString().split('T')[0]}`);
    
    // Process each day
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      try {
        // Use the Flight Offers Search API to get the best price for the date
        const response = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: dateString,
          adults: 1,
          max: 1, // Get just the best price
          nonStop: true // Only direct flights
        });

        if (response.data && response.data.length > 0) {
          const offer = response.data[0];
          if (offer.price) {
            const price = parseFloat(offer.price.total);
            console.log(`Found price for ${dateString}: $${price}`);
            
            prices.push({
              date: currentDate,
              price: price
            });
            
            // Add a small delay between API calls to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      } catch (error) {
        console.error(`Error getting price for ${currentDate.toISOString().split('T')[0]}:`, error);
      }
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Only save if we got some prices
    if (prices.length > 0) {
      console.log(`Saving ${prices.length} price points to database`);
      
      // Calculate average price for base price
      const total = prices.reduce((sum, p) => sum + p.price, 0);
      const averagePrice = Math.round(total / prices.length * 100) / 100;
      
      // Check if route already exists
      const existingRoutes = await getRoutes(origin, destination);
      
      if (existingRoutes.length === 0) {
        // Create new route with average price
        const newRoute: Omit<DbRoute, 'id' | 'created_at' | 'updated_at'> = {
          origin,
          destination,
          price: averagePrice,
          departure_date: startDate,
          return_date: null,
          airline: null,
          flight_number: null
        };
        
        await saveRoute(newRoute);
        console.log(`Created new route from ${origin} to ${destination}`);
      } else {
        console.log(`Route from ${origin} to ${destination} already exists`);
      }
    } else {
      console.warn('No prices found for the specified date range');
    }
    
    return prices;
  } catch (error) {
    console.error('Error in getAndSaveFlightPrices:', error);
    throw error;
  }
};

/**
 * Get popular routes from Amadeus API
 */
export const getPopularRoutes = async (cityCode: string, maxResults: number = 5): Promise<Array<{
  destination: string;
  averagePrice: number;
  popularity: number;
}>> => {
  try {
    const response = await amadeus.travel.analytics.airTraffic.booked.get({
      originCityCode: cityCode,
      period: '2017-2023'
    });
    
    return response.data
      .sort((a: any, b: any) => b.analytics.travelers.value - a.analytics.travelers.value)
      .slice(0, maxResults)
      .map((item: any) => ({
        destination: item.destination,
        averagePrice: item.analytics.flights.price.average,
        popularity: item.analytics.travelers.score
      }));
  } catch (error) {
    console.error('Error getting popular routes:', error);
    throw error;
  }
};
