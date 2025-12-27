import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PriceHistoryChart, { ChartType } from '../components/PriceHistoryChart';
import { getPriceHistory } from '../services/api';

interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
  type: string;
}

interface FlightDetails {
  carrier?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;
  bookingClass?: string;
}

interface PricePoint {
  price: number;
  recorded_at: string;
  flightDetails?: FlightDetails;
}

interface TabPanelProps {
  children: React.ReactNode;
  isActive: boolean;
  id: string;
}

function TabPanel({ children, isActive, id }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={id}
      className={`p-4 ${isActive ? 'block' : 'hidden'}`}
      aria-labelledby={`${id}-tab`}
    >
      {children}
    </div>
  );
}

type StopsFilter = 'cheapest' | '0' | '1' | '2' | '3+';

export default function PriceTrendsPage() {
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('LHR');
  const [tabValue, setTabValue] = useState(0);
  const [stopsFilter, setStopsFilter] = useState<StopsFilter>('cheapest');

  // Airport search states
  const [originInput, setOriginInput] = useState('JFK');
  const [destinationInput, setDestinationInput] = useState('LHR');
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Price alert states
  const [alertEmail, setAlertEmail] = useState('');
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  const filteredPrices = useMemo(() => {
    if (stopsFilter === 'cheapest') {
      return prices;
    }

    return prices.filter(p => {
      const stops = p.flightDetails?.stops;
      if (stops === undefined) return false;

      if (stopsFilter === '3+') {
        return stops >= 3;
      }
      return stops === parseInt(stopsFilter, 10);
    });
  }, [prices, stopsFilter]);

  const chartTypes: ChartType[] = ['line', 'burn-down', 'draw-down'];
  const chartTitles = [
    'Price History',
    'Price Burn Down',
    'Price Draw Down'
  ];

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  // Search for airports using Amadeus API
  const searchAirports = async (keyword: string): Promise<Airport[]> => {
    if (keyword.length < 2) return [];

    try {
      setIsSearching(true);
      const response = await axios.get('/.netlify/functions/airport-search', {
        params: { keyword }
      });

      if (response.data && response.data.airports) {
        return response.data.airports;
      }
      return [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  // Handle origin input change
  const handleOriginInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setOriginInput(value);

    if (value.length >= 2) {
      const airports = await searchAirports(value);
      setOriginSuggestions(airports);
      setShowOriginSuggestions(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
    }
  };

  // Handle destination input change
  const handleDestinationInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setDestinationInput(value);

    if (value.length >= 2) {
      const airports = await searchAirports(value);
      setDestinationSuggestions(airports);
      setShowDestinationSuggestions(true);
    } else {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  };

  // Select origin airport
  const handleSelectOrigin = (airport: Airport) => {
    setOriginInput(airport.iataCode);
    setOrigin(airport.iataCode);
    setShowOriginSuggestions(false);
  };

  // Select destination airport
  const handleSelectDestination = (airport: Airport) => {
    setDestinationInput(airport.iataCode);
    setDestination(airport.iataCode);
    setShowDestinationSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPriceTrends = async (from: string, to: string) => {
    try {
      setIsLoading(true);
      const response = await getPriceHistory(from, to);
      
      // Transform the prices array to match the expected format
      const formattedPrices = response.prices.map(item => ({
        price: item.price,
        recorded_at: item.date,
        flightDetails: item.flightDetails
      }));
      
      setPrices(formattedPrices);
      setError(null);
    } catch (err) {
      console.error('Error fetching price trends:', err);
      setError('Failed to load price trends. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceTrends(origin, destination);
  }, [origin, destination]);

  const handleUpdate = () => {
    if (originInput.length >= 3 && destinationInput.length >= 3) {
      setOrigin(originInput);
      setDestination(destinationInput);
    }
  };

  const handleSetAlert = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!alertEmail || !emailRegex.test(alertEmail)) {
      setAlertMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setAlertLoading(true);
    setAlertMessage(null);

    try {
      const response = await axios.post('/.netlify/functions/create-alert', {
        email: alertEmail,
        origin,
        destination,
      });

      if (response.data.success) {
        setAlertMessage({ type: 'success', text: response.data.message });
        setAlertEmail('');
      } else {
        setAlertMessage({ type: 'error', text: response.data.error || 'Failed to set alert.' });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set price alert. Please try again.';
      setAlertMessage({ type: 'error', text: errorMessage });
    } finally {
      setAlertLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-blue-600 hover:underline mr-4">
            &larr; Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Price Trends</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Flight Price History</h2>
            <p className="text-sm text-gray-500">
              Track price changes over time for your selected route
            </p>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Origin Input with Autocomplete */}
              <div ref={originRef} className="relative">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="text"
                  id="origin"
                  value={originInput}
                  onChange={handleOriginInputChange}
                  onFocus={() => originInput.length >= 2 && setShowOriginSuggestions(true)}
                  placeholder="City or IATA code (e.g., JFK, NYC)"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {originSuggestions.map((airport) => (
                      <div
                        key={airport.iataCode}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectOrigin(airport)}
                      >
                        <div className="font-medium text-sm">{airport.iataCode}</div>
                        <div className="text-xs text-gray-500">
                          {airport.name}
                          {airport.cityName && `, ${airport.cityName}`}
                          {airport.countryName && `, ${airport.countryName}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input with Autocomplete */}
              <div ref={destinationRef} className="relative">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  id="destination"
                  value={destinationInput}
                  onChange={handleDestinationInputChange}
                  onFocus={() => destinationInput.length >= 2 && setShowDestinationSuggestions(true)}
                  placeholder="City or IATA code (e.g., LHR, London)"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {destinationSuggestions.map((airport) => (
                      <div
                        key={airport.iataCode}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectDestination(airport)}
                      >
                        <div className="font-medium text-sm">{airport.iataCode}</div>
                        <div className="text-xs text-gray-500">
                          {airport.name}
                          {airport.cityName && `, ${airport.cityName}`}
                          {airport.countryName && `, ${airport.countryName}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stops Filter */}
              <div>
                <label htmlFor="stops" className="block text-sm font-medium text-gray-700 mb-1">Stops</label>
                <select
                  id="stops"
                  value={stopsFilter}
                  onChange={(e) => setStopsFilter(e.target.value as StopsFilter)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="cheapest">Cheapest</option>
                  <option value="0">Nonstop</option>
                  <option value="1">1 Stop</option>
                  <option value="2">2 Stops</option>
                  <option value="3+">3+ Stops</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isLoading || isSearching}
                  className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isLoading || isSearching ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? 'Loading...' : 'Update Chart'}
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Chart types">
                  {chartTypes.map((type, index) => (
                    <button
                      key={type}
                      onClick={() => handleTabChange(index)}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        tabValue === index
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      id={`${type}-tab`}
                      aria-controls={`${type}-panel`}
                      role="tab"
                      type="button"
                    >
                      {chartTitles[index]}
                    </button>
                  ))}
                </nav>
              </div>
              
              {chartTypes.map((type, index) => (
                <TabPanel 
                  key={type} 
                  id={`${type}-panel`}
                  isActive={tabValue === index}
                >
                  <div className="h-96">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
                    ) : filteredPrices.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No flights found with {stopsFilter === '0' ? 'nonstop' : stopsFilter === '3+' ? '3+ stops' : `${stopsFilter} stop${stopsFilter === '1' ? '' : 's'}`}
                      </div>
                    ) : (
                      <PriceHistoryChart
                        prices={filteredPrices}
                        loading={isLoading}
                        chartType={type}
                        title={chartTitles[index]}
                      />
                    )}
                  </div>
                </TabPanel>
              ))}
          </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Alerts</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set up price alerts to be notified when prices drop for {origin} → {destination}.
            </p>
            <div className="flex items-center">
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={alertLoading}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleSetAlert}
                disabled={alertLoading}
                className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  alertLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {alertLoading ? 'Setting...' : 'Set Alert'}
              </button>
            </div>
            {alertMessage && (
              <div className={`mt-3 p-3 rounded-md text-sm ${
                alertMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {alertMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
