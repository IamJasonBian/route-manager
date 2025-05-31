import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
    city: string;
  };
  arrival: {
    time: string;
    airport: string;
    city: string;
  };
  duration: string;
  price: number;
  stops: number;
}

export default function AvailableFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  useEffect(() => {
    // Simulate API call
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockFlights: Flight[] = [
          {
            id: '1',
            airline: 'Delta',
            flightNumber: 'DL123',
            departure: { time: '08:00', airport: 'JFK', city: 'New York' },
            arrival: { time: '20:30', airport: 'LHR', city: 'London' },
            duration: '7h 30m',
            price: 650,
            stops: 0
          },
          {
            id: '2',
            airline: 'British Airways',
            flightNumber: 'BA456',
            departure: { time: '10:15', airport: 'JFK', city: 'New York' },
            arrival: { time: '22:45', airport: 'LHR', city: 'London' },
            duration: '7h 30m',
            price: 720,
            stops: 0
          },
          {
            id: '3',
            airline: 'American Airlines',
            flightNumber: 'AA789',
            departure: { time: '14:30', airport: 'JFK', city: 'New York' },
            arrival: { time: '06:15', airport: 'LHR', city: 'London' },
            duration: '8h 45m',
            price: 590,
            stops: 1
          },
        ];
        
        // Sort flights
        const sortedFlights = [...mockFlights].sort((a, b) => {
          if (sortBy === 'price') return a.price - b.price;
          if (sortBy === 'departure') return a.departure.time.localeCompare(b.departure.time);
          return 0;
        });
        
        setFlights(sortedFlights);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-blue-600 hover:underline mr-4">
            &larr; Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Available Flights</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Filters and sorting */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-lg font-medium text-gray-900">New York (JFK) to London (LHR)</h2>
                <p className="text-sm text-gray-500">Friday, June 10, 2023</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'duration' | 'departure')}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="price">Price (Lowest first)</option>
                  <option value="departure">Departure time</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Flight list */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">Loading flights...</p>
              </div>
            ) : flights.length > 0 ? (
              flights.map((flight) => (
                <div key={flight.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    {/* Airline and flight info */}
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">{flight.airline[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{flight.airline}</h3>
                          <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Departure */}
                    <div className="flex-1">
                      <div className="text-right md:text-left">
                        <p className="text-lg font-semibold">{flight.departure.time}</p>
                        <p className="text-sm text-gray-500">{flight.departure.airport}</p>
                        <p className="text-xs text-gray-400">{flight.departure.city}</p>
                      </div>
                    </div>
                    
                    {/* Duration and stops */}
                    <div className="flex-1 text-center my-4 md:my-0">
                      <p className="text-sm text-gray-500">{flight.duration}</p>
                      <div className="relative mt-2">
                        <div className="h-px bg-gray-300 w-full absolute top-1/2"></div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          <span className="text-xs bg-white px-1 py-0.5 rounded-full border border-gray-300">
                            {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrival */}
                    <div className="flex-1">
                      <div>
                        <p className="text-lg font-semibold">{flight.arrival.time}</p>
                        <p className="text-sm text-gray-500">{flight.arrival.airport}</p>
                        <p className="text-xs text-gray-400">{flight.arrival.city}</p>
                      </div>
                    </div>
                    
                    {/* Price and book button */}
                    <div className="flex-1 text-right mt-4 md:mt-0">
                      <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                      <p className="text-xs text-gray-500 mb-2">round trip</p>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No flights found. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
