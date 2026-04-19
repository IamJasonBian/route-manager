import { useState, useEffect, useRef } from 'react';
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
        setError('No flights found. Try different search criteria.');
        setFlights([]);
      }
    } catch {
      setError('Failed to search for flights. Please try again.');
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  const SuggestionDropdown = ({ suggestions, onSelect }: { suggestions: Airport[]; onSelect: (a: Airport) => void }) => (
    <div className="absolute z-10 mt-1 w-full card shadow-lg max-h-60 overflow-auto">
      {suggestions.map((airport) => (
        <div
          key={airport.iataCode}
          className="px-3 py-2 hover:bg-[var(--muted-bg)] cursor-pointer"
          onClick={() => onSelect(airport)}
        >
          <div className="font-medium text-xs font-mono">{airport.iataCode}</div>
          <div className="text-xs text-[var(--muted)]">
            {airport.name}{airport.cityName && `, ${airport.cityName}`}{airport.countryName && `, ${airport.countryName}`}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-lg font-semibold text-[var(--foreground)] tracking-tight mb-6">Search Flights</h1>

      <div className="card p-5 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex gap-1 mb-4">
            {(['one-way', 'round-trip'] as const).map((type) => (
              <button
                key={type}
                type="button"
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tripType === type
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
                }`}
                onClick={() => setTripType(type)}
              >
                {type === 'one-way' ? 'One Way' : 'Round Trip'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <div ref={originRef} className="relative">
              <label className="label">From</label>
              <input type="text" value={originInput} onChange={handleOriginInputChange}
                onFocus={() => originInput.length >= 2 && setShowOriginSuggestions(true)}
                placeholder="JFK" className="input font-mono" />
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <SuggestionDropdown suggestions={originSuggestions} onSelect={handleSelectOrigin} />
              )}
            </div>

            <div ref={destinationRef} className="relative">
              <label className="label">To</label>
              <input type="text" value={destinationInput} onChange={handleDestinationInputChange}
                onFocus={() => destinationInput.length >= 2 && setShowDestinationSuggestions(true)}
                placeholder="LAX" className="input font-mono" />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <SuggestionDropdown suggestions={destinationSuggestions} onSelect={handleSelectDestination} />
              )}
            </div>

            <div>
              <label className="label">Departure</label>
              <input type="date" required value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input" />
            </div>

            {tripType === 'round-trip' && (
              <div>
                <label className="label">Return</label>
                <input type="date" required value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  className="input" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || isLoadingAirports}
            className="btn-primary w-full"
          >
            {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SearchIcon className="h-3.5 w-3.5" />}
            {isSearching ? 'Searching...' : 'Search Flights'}
          </button>

          {error && (
            <div className="mt-3 p-3 bg-[var(--destructive-bg)] text-[var(--destructive)] rounded-md text-xs">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-sm font-medium text-[var(--foreground)] mb-3">
          Results {flights.length > 0 && <span className="text-[var(--muted)]">({flights.length})</span>}
        </h2>

        {isSearching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 text-[var(--muted)] animate-spin" />
          </div>
        ) : flights.length > 0 ? (
          <div className="space-y-2">
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
                <div key={index} className="card overflow-hidden">
                  <div className="bg-[var(--muted-bg)] px-4 py-2.5 border-b border-[var(--border)] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-[var(--foreground)]">
                        {dep.departure.iataCode} &rarr; {arr.arrival.iataCode}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <div className="text-sm font-semibold font-mono text-[var(--foreground)]">
                      ${price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)]">{formatDate(dep.departure.at)}</div>
                        <div className="text-xs text-[var(--muted)] font-mono">{dep.departure.iataCode}</div>
                      </div>
                      <div className="text-center px-4">
                        <div className="text-xs text-[var(--muted)]">
                          {formatDuration(dep.departure.at, arr.arrival.at)}
                        </div>
                        <div className="border-t border-[var(--border)] w-12 my-1 mx-auto"></div>
                        <div className="text-xs text-[var(--muted)]">
                          {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[var(--foreground)]">{formatDate(arr.arrival.at)}</div>
                        <div className="text-xs text-[var(--muted)] font-mono">{arr.arrival.iataCode}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[var(--foreground)]">
                          {airlines[dep.carrierCode] || dep.carrierCode}
                        </div>
                        <div className="text-xs text-[var(--muted)] font-mono">
                          {dep.carrierCode}{dep.number} &middot;{' '}
                          {flight.travelerPricings[0].fareDetailsBySegment[0].cabin.charAt(0).toUpperCase() +
                            flight.travelerPricings[0].fareDetailsBySegment[0].cabin.slice(1).toLowerCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProposeTripModal
                          trigger={
                            <button className="btn-secondary text-xs px-3 py-1.5">
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
                          className="btn-primary text-xs px-3 py-1.5"
                        >
                          Book Flight
                          <ExternalLinkIcon className="h-3 w-3" />
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
            <PlaneIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">
              {origin || destination || departureDate
                ? 'No flights found. Try adjusting your search.'
                : 'Enter your search criteria to find flights.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
