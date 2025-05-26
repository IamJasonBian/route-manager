import React, { useState } from 'react';
import { format } from 'date-fns';

interface FlightOffer {
  id: string;
  itineraries: {
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
        terminal?: string;
      };
      arrival: {
        iataCode: string;
        at: string;
        terminal?: string;
      };
      carrierCode: string;
      number: string;
    }>;
  }[];
  price: {
    currency: string;
    total: string;
  };
}

export const FlightSearch: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async () => {
    if (!origin || !destination || !departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/search-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          departureDate: format(departureDate, 'yyyy-MM-dd'),
          ...(returnDate && { returnDate: format(returnDate, 'yyyy-MM-dd') }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setFlights(data.data || []);
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search for flights. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to a more readable format
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return `${hours}${minutes}`.trim();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Search Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              From (IATA code)
            </label>
            <input
              type="text"
              id="origin"
              placeholder="e.g., JFK"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To (IATA code)
            </label>
            <input
              type="text"
              id="destination"
              placeholder="e.g., LAX"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              value={departureDate ? format(departureDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setDepartureDate(e.target.valueAsDate || undefined)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
              Return Date (optional)
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnDate ? format(returnDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setReturnDate(e.target.valueAsDate || undefined)}
              min={departureDate ? format(departureDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {flights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-medium text-lg">
                      {flight.itineraries[0].segments[0].departure.iataCode} → 
                      {flight.itineraries[0].segments[0].arrival.iataCode}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDuration(flight.itineraries[0].duration)}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xl font-bold text-blue-600">
                      {flight.price.currency} {flight.price.total}
                    </p>
                    <p className="text-sm text-gray-500">
                      {flight.itineraries[0].segments[0].carrierCode} {flight.itineraries[0].segments[0].number}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">Departure</p>
                      <p>{new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</p>
                      <p className="text-gray-500">Terminal: {flight.itineraries[0].segments[0].departure.terminal || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Arrival</p>
                      <p>{new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleString()}</p>
                      <p className="text-gray-500">Terminal: {flight.itineraries[0].segments[0].arrival.terminal || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
