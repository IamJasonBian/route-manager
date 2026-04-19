import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ExternalLinkIcon, Loader2, PlaneIcon } from 'lucide-react';
import axios from 'axios';
import { buildGoogleFlightsUrl } from '../utils/googleFlights';
import { ProposeTripModal } from '../components/ProposeTripModal';

interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
  type: string;
}

interface Flight {
  id: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  itineraries: Array<{
    segments: Array<{
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      carrierCode: string;
      number: string;
      aircraft: { code: string };
    }>;
  }>;
  price: { total: string; currency: string };
  travelerPricings: Array<{
    fareDetailsBySegment: Array<{ cabin: string; class: string }>;
  }>;
}

const airlines: Record<string, string> = {
  'AA': 'American Airlines', 'DL': 'Delta Air Lines', 'UA': 'United Airlines',
  'WN': 'Southwest Airlines', 'B6': 'JetBlue Airways', 'AS': 'Alaska Airlines',
  'NK': 'Spirit Airlines', 'F9': 'Frontier Airlines', 'BA': 'British Airways',
  'LH': 'Lufthansa', 'AF': 'Air France', 'KL': 'KLM', 'TK': 'Turkish Airlines',
  'EK': 'Emirates', 'QR': 'Qatar Airways', 'AC': 'Air Canada',
  'NH': 'All Nippon Airways', 'JL': 'Japan Airlines', 'SQ': 'Singapore Airlines',
};

export default function SearchFlightsPage() {
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('LAX');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [isSearching, setIsSearching] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [originInput, setOriginInput] = useState('JFK');
  const [destinationInput, setDestinationInput] = useState('LAX');
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const formatDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const searchAirports = async (keyword: string): Promise<Airport[]> => {
    if (keyword.length < 2) return [];
    try {
      setIsLoadingAirports(true);
      const response = await axios.get('/.netlify/functions/airport-search', { params: { keyword } });
      return response.data?.airports || [];
    } catch {
      return [];
    } finally {
      setIsLoadingAirports(false);
    }
  };

  const handleOriginInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setOriginInput(value);
    if (value.length >= 2) {
      setOriginSuggestions(await searchAirports(value));
      setShowOriginSuggestions(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
    }
  };

  const handleDestinationInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setDestinationInput(value);
    if (value.length >= 2) {
      setDestinationSuggestions(await searchAirports(value));
      setShowDestinationSuggestions(true);
    } else {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  };

  const handleSelectOrigin = (airport: Airport) => {
    setOriginInput(airport.iataCode);
    setOrigin(airport.iataCode);
    setShowOriginSuggestions(false);
  };

  const handleSelectDestination = (airport: Airport) => {
    setDestinationInput(airport.iataCode);
    setDestination(airport.iataCode);
    setShowDestinationSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) setShowOriginSuggestions(false);
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) setShowDestinationSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        origin: origin.toUpperCase(), destination: destination.toUpperCase(),
        departureDate, returnDate: tripType === 'round-trip' ? returnDate : undefined,
        maxResults: 10, nonStop: false,
      });
      if (response.data?.data) {
        setFlights(response.data.data);
      } else {
        setError('No flights found. Please try different search criteria.');
        setFlights([]);
      }
    } catch {
      setError('Failed to search for flights. Please try again later.');
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  const inputClass = "w-full border border-[var(--border)] rounded px-3 py-2 bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";
  const labelClass = "block text-sm font-medium text-[var(--foreground)] mb-1";

  const SuggestionDropdown = ({ suggestions, onSelect }: { suggestions: Airport[]; onSelect: (a: Airport) => void }) => (
    <div className="absolute z-10 mt-1 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-auto">
      {suggestions.map((airport) => (
        <div
          key={airport.iataCode}
          className="px-4 py-2 hover:bg-[var(--muted-bg)] cursor-pointer"
          onClick={() => onSelect(airport)}
        >
          <div className="font-medium text-sm font-mono">{airport.iataCode}</div>
          <div className="text-xs text-[var(--muted)]">
            {airport.name}{airport.cityName && `, ${airport.cityName}`}{airport.countryName && `, ${airport.countryName}`}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-[var(--link)] hover:opacity-80 mr-4">&larr; Home</Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Search Flights</h1>
      </div>

      <div className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex gap-1 mb-6">
            {(['one-way', 'round-trip'] as const).map((type) => (
              <button
                key={type}
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  tripType === type
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
                onClick={() => setTripType(type)}
              >
                {type === 'one-way' ? 'One Way' : 'Round Trip'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div ref={originRef} className="relative">
              <label className={labelClass}>From</label>
              <input type="text" value={originInput} onChange={handleOriginInputChange}
                onFocus={() => originInput.length >= 2 && setShowOriginSuggestions(true)}
                placeholder="JFK" className={`${inputClass} font-mono`} />
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <SuggestionDropdown suggestions={originSuggestions} onSelect={handleSelectOrigin} />
              )}
            </div>

            <div ref={destinationRef} className="relative">
              <label className={labelClass}>To</label>
              <input type="text" value={destinationInput} onChange={handleDestinationInputChange}
                onFocus={() => destinationInput.length >= 2 && setShowDestinationSuggestions(true)}
                placeholder="LAX" className={`${inputClass} font-mono`} />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <SuggestionDropdown suggestions={destinationSuggestions} onSelect={handleSelectDestination} />
              )}
            </div>

            <div>
              <label className={labelClass}>Departure</label>
              <input type="date" required value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={inputClass} />
            </div>

            {tripType === 'round-trip' && (
              <div>
                <label className={labelClass}>Return</label>
                <input type="date" required value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  className={inputClass} />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || isLoadingAirports}
            className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            {isSearching ? 'Searching...' : 'Search Flights'}
          </button>

          {error && (
            <div className="mt-4 p-3 border border-[var(--destructive)] bg-red-50 dark:bg-red-950 text-[var(--destructive)] rounded text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Results */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Results {flights.length > 0 && `(${flights.length})`}
          </h2>

          {isSearching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-[var(--accent)] animate-spin" />
            </div>
          ) : flights.length > 0 ? (
            <div className="space-y-3">
              {flights.map((flight, index) => {
                const segments = flight.itineraries[0].segments;
                const dep = segments[0];
                const arr = segments[segments.length - 1];
                const stops = segments.length - 1;
                const price = parseFloat(flight.price.total);

                const bookingUrl = buildGoogleFlightsUrl({
                  origin: dep.departure.iataCode,
                  destination: arr.arrival.iataCode,
                  departureDate: dep.departure.at.split('T')[0],
                  returnDate: tripType === 'round-trip' ? returnDate : undefined,
                });

                return (
                  <div key={index} className="border border-[var(--border)] rounded-lg overflow-hidden">
                    <div className="bg-[var(--muted-bg)] px-4 py-3 border-b border-[var(--border)] flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-[var(--foreground)]">
                          {dep.departure.iataCode} &rarr; {arr.arrival.iataCode}
                        </span>
                        <span className="text-sm text-[var(--muted)]">
                          {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      <div className="text-lg font-bold font-mono text-[var(--foreground)]">
                        ${price.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[var(--foreground)]">{formatDate(dep.departure.at)}</div>
                          <div className="text-sm text-[var(--muted)] font-mono">{dep.departure.iataCode}</div>
                        </div>
                        <div className="text-center px-4">
                          <div className="text-sm text-[var(--muted)]">
                            {formatDuration(dep.departure.at, arr.arrival.at)}
                          </div>
                          <div className="border-t border-[var(--border)] w-16 my-1"></div>
                          <div className="text-xs text-[var(--muted)]">
                            {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[var(--foreground)]">{formatDate(arr.arrival.at)}</div>
                          <div className="text-sm text-[var(--muted)] font-mono">{arr.arrival.iataCode}</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {airlines[dep.carrierCode] || dep.carrierCode}
                          </div>
                          <div className="text-xs text-[var(--muted)]">
                            {dep.carrierCode}{dep.number} &middot;{' '}
                            {flight.travelerPricings[0].fareDetailsBySegment[0].cabin.charAt(0).toUpperCase() +
                              flight.travelerPricings[0].fareDetailsBySegment[0].cabin.slice(1).toLowerCase()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ProposeTripModal
                            trigger={
                              <button className="px-3 py-2 border border-[var(--accent)] text-[var(--accent)] text-sm font-medium rounded hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors">
                                Propose Trip
                              </button>
                            }
                            defaultOrigin={dep.departure.iataCode}
                            defaultDestination={arr.arrival.iataCode}
                            defaultDepartureDate={dep.departure.at.split('T')[0]}
                            defaultReturnDate={tripType === 'round-trip' ? returnDate : undefined}
                            defaultPrice={price}
                          />
                          <a
                            href={bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium rounded hover:opacity-90 transition-opacity"
                          >
                            Book Flight
                            <ExternalLinkIcon className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--muted)]">
              <PlaneIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                {origin || destination || departureDate
                  ? 'No flights found. Try adjusting your search.'
                  : 'Enter your search criteria to find flights.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
