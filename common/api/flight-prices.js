// Flight prices API endpoint
import express from 'express';
import Amadeus from 'amadeus';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
  hostname: process.env.AMADEUS_HOSTNAME || 'production'
});

// Enable CORS for all routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Handle preflight OPTIONS request
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET');
  res.status(200).send();
});

// Get flight prices
router.get('/', async (req, res) => {
  try {
    const { from, to, departureDate, returnDate } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    // Get flight offers
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from.toUpperCase(),
      destinationLocationCode: to.toUpperCase(),
      departureDate: departureDate || new Date().toISOString().split('T')[0],
      returnDate: returnDate || '',
      adults: 1,
      max: 10
    });

    // Process the response
    const prices = response.data.map(offer => ({
      departure_date: offer.itineraries[0].segments[0].departure.at.split('T')[0],
      price: offer.price.total,
      currency: offer.price.currency,
      airline: offer.validatingAirlineCodes ? offer.validatingAirlineCodes[0] : 'Unknown',
      flight_number: offer.itineraries[0].segments[0].number || 'N/A'
    }));

    res.json(prices);
  } catch (error) {
    console.error('Error fetching flight prices:', error);
    res.status(500).json({ 
      error: 'Failed to fetch flight prices',
      details: error.response?.data?.errors || error.message 
    });
  }
});

export default router;
