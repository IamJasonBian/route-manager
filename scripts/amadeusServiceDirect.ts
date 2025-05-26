import Amadeus from 'amadeus';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });

// Log environment variables (for debugging)
console.log('Amadeus Service - Environment variables:', {
  AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ? '***' : 'Not found',
  AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ? '***' : 'Not found',
  AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME || 'Not found',
});

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
  hostname: process.env.AMADEUS_HOSTNAME === 'production' ? 'production' : 'test',
});

interface FlightPrice {
  origin: string;
  destination: string;
  departureDate: Date;
  price: number;
  currency: string;
  airline?: string;
  flightNumber?: string;
}

/**
 * Extracts IATA airport code from a string that might contain additional text
 * @param location Location string that might contain IATA code in parentheses or be the code itself
 * @returns The 3-letter IATA airport code
 */
function extractIataCode(location: string): string {
  // If it's already a 3-letter code, return it uppercase
  if (/^[A-Z]{3}$/i.test(location.trim())) {
    return location.trim().toUpperCase();
  }
  
  // Try to extract code from format like "New York (JFK)"
  const match = location.match(/\(([A-Z]{3})\)/i);
  if (match && match[1]) {
    return match[1].toUpperCase();
  }
  
  // If no match found, assume it's already a code but clean it up
  return location.trim().toUpperCase();
}

/**
 * Fetches flight prices from Amadeus API and saves them to the database
 * @param origin Origin airport code or description (e.g., 'JFK' or 'New York (JFK)')
 * @param destination Destination airport code or description (e.g., 'LAX' or 'Los Angeles (LAX)')
 * @param startDate Start date for price search
 * @param days Number of days to search (default: 14)
 * @returns Array of saved flight prices
 */
export async function getAndSaveFlightPrices(
  origin: string,
  destination: string,
  startDate: Date = new Date(),
  days: number = 14
): Promise<FlightPrice[]> {
  // Extract IATA codes from the input
  const originCode = extractIataCode(origin);
  const destinationCode = extractIataCode(destination);
  
  console.log(`Fetching flight prices for ${originCode} to ${destinationCode} for the next ${days} days`);
  
  const savedPrices: FlightPrice[] = [];
  
  // Validate IATA codes
  if (!/^[A-Z]{3}$/.test(originCode) || !/^[A-Z]{3}$/.test(destinationCode)) {
    console.error(`Invalid IATA codes - Origin: ${originCode}, Destination: ${destinationCode}`);
    return [];
  }
  
  try {
    // Fetch prices for each day in the range
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];
      
      try {
        console.log(`Fetching prices for ${originCode} to ${destinationCode} on ${dateString}...`);
        
        const response = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate: dateString,
          adults: 1,
          max: 1,
          nonStop: true
        });
        
        if (response.data && response.data.length > 0) {
          const bestOffer = response.data[0];
          const price = parseFloat(bestOffer.price.total);
          const currency = bestOffer.price.currency;
          
          // Get flight details
          const flight = bestOffer.itineraries[0].segments[0];
          const airline = flight.carrierCode;
          const flightNumber = flight.number;
          
          const flightPrice: FlightPrice = {
            origin: originCode,
            destination: destinationCode,
            departureDate: new Date(flight.departure.at),
            price,
            currency,
            airline,
            flightNumber
          };
          
          console.log(`Best price for ${originCode} to ${destinationCode} on ${dateString}: ${price} ${currency}`);
          
          try {
            // Save to database
            await saveRoute({
              origin: originCode,
              destination: destinationCode,
              price,
              departure_date: new Date(flight.departure.at),
              return_date: null,
              airline,
              flight_number: flightNumber
            });
            console.log(`✅ Successfully saved price for ${originCode} to ${destinationCode} on ${dateString}`);
          } catch (saveError) {
            console.error(`❌ Error saving route to database:`, saveError);
          }
          
          savedPrices.push(flightPrice);
        } else {
          console.log(`No flights found for ${dateString}`);
        }
        
        // Add a small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error fetching prices for ${dateString}:`, error);
        // Continue with the next date even if one fails
      }
    }
    
    return savedPrices;
    
  } catch (error) {
    console.error('Error in getAndSaveFlightPrices:', error);
    throw error;
  }
}

// Import the saveRoute function from our direct route service
import { saveRoute } from './routeServiceDirect';
