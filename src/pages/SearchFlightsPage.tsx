import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Flight {
  id: string;
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
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
  price: {
    total: string;
    currency: string;
  };
  travelerPricings: Array<{
    fareDetailsBySegment: Array<{
      cabin: string;
      class: string;
    }>;
  }>;
}

export default function SearchFlightsPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [isSearching, setIsSearching] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Airline name mapping
  const getAirlineName = (carrierCode: string): string => {
    const airlines: { [key: string]: string } = {
      'AA': 'American Airlines',
      'DL': 'Delta Air Lines',
      'UA': 'United Airlines',
      'WN': 'Southwest Airlines',
      'B6': 'JetBlue Airways',
      'AS': 'Alaska Airlines',
      'NK': 'Spirit Airlines',
      'F9': 'Frontier Airlines',
      'G4': 'Allegiant Air',
      'TP': 'TAP Portugal',
      'BA': 'British Airways',
      'LH': 'Lufthansa',
      'AF': 'Air France',
      'KL': 'KLM Royal Dutch Airlines',
      'IB': 'Iberia',
      'AZ': 'ITA Airways',
      'EI': 'Aer Lingus',
      'LX': 'Swiss International Air Lines',
      'OS': 'Austrian Airlines',
      'SN': 'Brussels Airlines',
      'TK': 'Turkish Airlines',
      'EK': 'Emirates',
      'QR': 'Qatar Airways',
      'EY': 'Etihad Airways',
      'SV': 'Saudia',
      'AC': 'Air Canada',
      'NH': 'All Nippon Airways',
      'JL': 'Japan Airlines',
      'SQ': 'Singapore Airlines',
      'CX': 'Cathay Pacific',
      'QF': 'Qantas',
      'NZ': 'Air New Zealand'
    };
    return airlines[carrierCode] || carrierCode;
  };

  // Generate Google Flights booking link
  const getBookingLink = (flight: Flight): string => {
    const dep = flight.itineraries[0].segments[0];
    const arr = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
    const depDate = dep.departure.at.split('T')[0];

    // Build Google Flights URL with actual flight details
    const origin = dep.departure.iataCode;
    const destination = arr.arrival.iataCode;

    return `https://www.google.com/travel/flights/search?tfs=CBwQAhopEgoyMDI1LTAxLTAxagcIARIDJHtvcmlnaW59cgwIAxIIJHtkZXN0aW5hdGlvbn0&hl=en&curr=USD`.replace('{origin}', origin).replace('{destination}', destination).replace('2025-01-01', depDate);
  };

  const popularAirports = [
    { iataCode: 'JFK', name: 'John F. Kennedy Intl (New York)' },
    { iataCode: 'LAX', name: 'Los Angeles Intl' },
    { iataCode: 'ORD', name: "Chicago O'Hare Intl" },
    { iataCode: 'SFO', name: 'San Francisco Intl' },
    { iataCode: 'SEA', name: 'Seattle-Tacoma Intl' },
  ];

  const handleOriginFocus = () => {
    setShowOriginSuggestions(true);
    setShowDestinationSuggestions(false);
  };

  const handleDestinationFocus = () => {
    setShowDestinationSuggestions(true);
    setShowOriginSuggestions(false);
  };

  const handleSelectAirport = (airport: {iataCode: string, name: string}, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setOrigin(airport.iataCode);
      setShowOriginSuggestions(false);
    } else {
      setDestination(airport.iataCode);
      setShowDestinationSuggestions(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!origin || !destination || !departureDate || (tripType === 'round-trip' && !returnDate)) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await axios.post('/.netlify/functions/search-flights', {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate,
        returnDate: tripType === 'round-trip' ? returnDate : undefined,
        maxResults: 10,
        nonStop: false
      });
      
      if (response.data && response.data.data) {
        setFlights(response.data.data);
      } else {
        setError('No flights found. Please try different search criteria.');
        setFlights([]);
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search for flights. Please try again later.');
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-blue-600 hover:underline mr-4">
            &larr; Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Search Flights</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Find Your Perfect Flight</h2>
            <p className="text-sm text-gray-500">
              Search for flights and compare prices from multiple airlines
            </p>
          </div>

          <form onSubmit={handleSearch}>
            {/* Trip Type Toggle */}
            <div className="flex space-x-2 mb-6">
              <button
                type="button"
                className={`px-4 py-2 rounded-l-lg text-sm font-medium ${tripType === 'one-way' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTripType('one-way')}
              >
                One Way
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-r-lg text-sm font-medium ${tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTripType('round-trip')}
              >
                Round Trip
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Origin Input with Suggestions */}
              <div className="relative">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative">
                  <input
                    type="text"
                    id="origin"
                    placeholder="City or Airport"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    onFocus={handleOriginFocus}
                  />
                  {showOriginSuggestions && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {popularAirports.map((airport) => (
                        <div
                          key={airport.iataCode}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectAirport(airport, 'origin')}
                        >
                          <div className="font-medium">{airport.iataCode}</div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Destination Input with Suggestions */}
              <div className="relative">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="relative">
                  <input
                    type="text"
                    id="destination"
                    placeholder="City or Airport"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={handleDestinationFocus}
                  />
                  {showDestinationSuggestions && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {popularAirports.map((airport) => (
                        <div
                          key={airport.iataCode}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectAirport(airport, 'destination')}
                        >
                          <div className="font-medium">{airport.iataCode}</div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <input
                  type="date"
                  id="departureDate"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Return Date - Conditionally Rendered */}
              {tripType === 'round-trip' && (
                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                  <input
                    type="date"
                    id="returnDate"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required={tripType === 'round-trip'}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSearching}
                className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSearching ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSearching ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                    </svg>
                    Search Flights
                  </span>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>
          
          {/* Search results */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Search Results {flights.length > 0 && `(${flights.length} found)`}
            </h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {isSearching ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : flights.length > 0 ? (
              <div className="space-y-4">
                {flights.map((flight, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {flight.itineraries[0].segments[0].departure.iataCode} → 
                          {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {flight.itineraries[0].segments.length - 1} stop{flight.itineraries[0].segments.length > 2 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-lg font-bold">
                        ${parseFloat(flight.price.total).toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {formatDate(flight.itineraries[0].segments[0].departure.at)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.itineraries[0].segments[0].departure.iataCode}
                          </div>
                        </div>
                        <div className="text-center px-4">
                          <div className="text-sm text-gray-500">
                            {formatDuration(
                              flight.itineraries[0].segments[0].departure.at,
                              flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at
                            )}
                          </div>
                          <div className="border-t border-gray-200 w-16 my-1"></div>
                          <div className="text-xs text-gray-500">
                            {flight.itineraries[0].segments.length === 1 ? 'Nonstop' : `${flight.itineraries[0].segments.length - 1} stop${flight.itineraries[0].segments.length > 2 ? 's' : ''}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatDate(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-700">
                              {getAirlineName(flight.itineraries[0].segments[0].carrierCode)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Flight {flight.itineraries[0].segments[0].carrierCode}{flight.itineraries[0].segments[0].number} •
                              {flight.travelerPricings[0].fareDetailsBySegment[0].cabin.charAt(0).toUpperCase() +
                               flight.travelerPricings[0].fareDetailsBySegment[0].cabin.slice(1).toLowerCase()} •
                              {flight.itineraries[0].segments[0].aircraft.code}
                            </div>
                          </div>
                          <a
                            href={getBookingLink(flight)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            Book Flight
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {origin || destination || departureDate 
                    ? 'Try adjusting your search criteria.'
                    : 'Enter your search criteria to find flights.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
