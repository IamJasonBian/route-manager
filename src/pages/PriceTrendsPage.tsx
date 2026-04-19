import { useState, useEffect, useRef, useMemo } from 'react';
import { Loader2, MapPinIcon, ExternalLinkIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import PriceHistoryChart, { ChartType } from '../components/PriceHistoryChart';
import { getPriceHistory } from '../services/api';
import { buildGoogleFlightsUrl } from '../utils/googleFlights';
import { ProposeTripModal } from '../components/ProposeTripModal';

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

type StopsFilter = 'cheapest' | '0' | '1' | '2' | '3+';

const AIRPORT_COORDS: { code: string; lat: number; lon: number; name: string }[] = [
  { code: 'DTW', lat: 42.2124, lon: -83.3534, name: 'Detroit' },
  { code: 'JFK', lat: 40.6413, lon: -73.7781, name: 'New York JFK' },
  { code: 'LGA', lat: 40.7769, lon: -73.8740, name: 'New York LaGuardia' },
  { code: 'EWR', lat: 40.6895, lon: -74.1745, name: 'Newark' },
  { code: 'LAX', lat: 33.9416, lon: -118.4085, name: 'Los Angeles' },
  { code: 'ORD', lat: 41.9742, lon: -87.9073, name: 'Chicago O\'Hare' },
  { code: 'SFO', lat: 37.6213, lon: -122.3790, name: 'San Francisco' },
  { code: 'SEA', lat: 47.4502, lon: -122.3088, name: 'Seattle' },
  { code: 'MIA', lat: 25.7959, lon: -80.2870, name: 'Miami' },
  { code: 'DFW', lat: 32.8998, lon: -97.0403, name: 'Dallas' },
  { code: 'ATL', lat: 33.6407, lon: -84.4277, name: 'Atlanta' },
  { code: 'BOS', lat: 42.3656, lon: -71.0096, name: 'Boston' },
  { code: 'DEN', lat: 39.8561, lon: -104.6737, name: 'Denver' },
  { code: 'PHX', lat: 33.4373, lon: -112.0078, name: 'Phoenix' },
  { code: 'IAH', lat: 29.9902, lon: -95.3368, name: 'Houston' },
];

function findNearestAirport(lat: number, lon: number) {
  let nearest = AIRPORT_COORDS[0];
  let minDist = Infinity;
  for (const airport of AIRPORT_COORDS) {
    const dist = Math.sqrt(Math.pow(airport.lat - lat, 2) + Math.pow(airport.lon - lon, 2));
    if (dist < minDist) { minDist = dist; nearest = airport; }
  }
  return { code: nearest.code, name: nearest.name };
}

export default function PriceTrendsPage() {
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('DTW');
  const [tabValue, setTabValue] = useState(0);
  const [stopsFilter, setStopsFilter] = useState<StopsFilter>('cheapest');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedAirport, setDetectedAirport] = useState<{ code: string; name: string } | null>(null);

  const [originInput, setOriginInput] = useState('JFK');
  const [destinationInput, setDestinationInput] = useState('DTW');
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  const filteredPrices = useMemo(() => {
    if (stopsFilter === 'cheapest') return prices;
    return prices.filter(p => {
      const stops = p.flightDetails?.stops;
      if (stops === undefined) return false;
      if (stopsFilter === '3+') return stops >= 3;
      return stops === parseInt(stopsFilter, 10);
    });
  }, [prices, stopsFilter]);

  const lowestPrice = useMemo(() => {
    if (filteredPrices.length === 0) return undefined;
    return Math.min(...filteredPrices.map(p => p.price));
  }, [filteredPrices]);

  const chartTypes: ChartType[] = ['line', 'burn-down', 'draw-down'];
  const chartTitles = ['Price History', 'Price Burn Down', 'Price Draw Down'];

  const searchAirports = async (keyword: string): Promise<Airport[]> => {
    if (keyword.length < 2) return [];
    try {
      setIsSearching(true);
      const response = await axios.get('/.netlify/functions/airport-search', { params: { keyword } });
      return response.data?.airports || [];
    } catch { return []; }
    finally { setIsSearching(false); }
  };

  const handleOriginInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setOriginInput(value);
    if (value.length >= 2) { setOriginSuggestions(await searchAirports(value)); setShowOriginSuggestions(true); }
    else { setOriginSuggestions([]); setShowOriginSuggestions(false); }
  };

  const handleDestinationInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setDestinationInput(value);
    if (value.length >= 2) { setDestinationSuggestions(await searchAirports(value)); setShowDestinationSuggestions(true); }
    else { setDestinationSuggestions([]); setShowDestinationSuggestions(false); }
  };

  const handleSelectOrigin = (airport: Airport) => { setOriginInput(airport.iataCode); setOrigin(airport.iataCode); setShowOriginSuggestions(false); };
  const handleSelectDestination = (airport: Airport) => { setDestinationInput(airport.iataCode); setDestination(airport.iataCode); setShowDestinationSuggestions(false); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) setShowOriginSuggestions(false);
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) setShowDestinationSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedAirport = localStorage.getItem('userHomeAirport');
    if (savedAirport) { setOrigin(savedAirport); setOriginInput(savedAirport); }
    else { setShowLocationPrompt(true); }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) { setDetectedAirport({ code: 'JFK', name: 'New York JFK' }); return; }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setDetectedAirport(findNearestAirport(pos.coords.latitude, pos.coords.longitude)); setIsDetectingLocation(false); },
      () => { setDetectedAirport({ code: 'JFK', name: 'New York JFK' }); setIsDetectingLocation(false); },
      { timeout: 10000 }
    );
  };

  const confirmDetectedAirport = () => {
    if (detectedAirport) {
      localStorage.setItem('userHomeAirport', detectedAirport.code);
      setOrigin(detectedAirport.code); setOriginInput(detectedAirport.code);
      setShowLocationPrompt(false); setDetectedAirport(null);
    }
  };

  const dismissLocationPrompt = () => { localStorage.setItem('userHomeAirport', 'JFK'); setShowLocationPrompt(false); setDetectedAirport(null); };

  const fetchPriceTrends = async (from: string, to: string) => {
    try {
      setIsLoading(true);
      const response = await getPriceHistory(from, to);
      setPrices(response.prices.map(item => ({ price: item.price, recorded_at: item.date, flightDetails: item.flightDetails })));
      setError(null);
    } catch { setError('Failed to load price trends.'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPriceTrends(origin, destination); }, [origin, destination]);

  const handleUpdate = () => {
    if (originInput.length >= 3 && destinationInput.length >= 3) { setOrigin(originInput); setDestination(destinationInput); }
  };

  const SuggestionDropdown = ({ suggestions, onSelect }: { suggestions: Airport[]; onSelect: (a: Airport) => void }) => (
    <div className="absolute z-10 mt-1 w-full card shadow-lg max-h-60 overflow-auto">
      {suggestions.map((airport) => (
        <div key={airport.iataCode} className="px-3 py-2 hover:bg-[var(--muted-bg)] cursor-pointer" onClick={() => onSelect(airport)}>
          <div className="font-medium text-xs font-mono">{airport.iataCode}</div>
          <div className="text-xs text-[var(--muted)]">{airport.name}{airport.cityName && `, ${airport.cityName}`}{airport.countryName && `, ${airport.countryName}`}</div>
        </div>
      ))}
    </div>
  );

  const googleFlightsUrl = buildGoogleFlightsUrl({ origin, destination });

  return (
    <div>
      <h1 className="text-lg font-semibold text-[var(--foreground)] tracking-tight mb-6">Price Trends</h1>

      {showLocationPrompt && (
        <div className="card p-4 mb-6 border-[var(--info)]">
          <div className="flex items-start">
            <MapPinIcon className="h-4 w-4 text-[var(--info)] flex-shrink-0 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-[var(--foreground)]">Set your home airport</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {detectedAirport
                  ? `Detected: ${detectedAirport.name} (${detectedAirport.code}). Use this?`
                  : 'Allow location access to find your nearest airport.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {!detectedAirport && !isDetectingLocation && (
                  <button onClick={requestLocation} className="btn-primary text-xs px-3 py-1.5">
                    <MapPinIcon className="h-3 w-3" /> Use My Location
                  </button>
                )}
                {isDetectingLocation && (
                  <div className="flex items-center text-xs text-[var(--muted)]">
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Detecting...
                  </div>
                )}
                {detectedAirport && (
                  <>
                    <button onClick={confirmDetectedAirport} className="btn-primary text-xs px-3 py-1.5">
                      Yes, use {detectedAirport.code}
                    </button>
                    <button onClick={() => setDetectedAirport(null)} className="btn-secondary text-xs px-3 py-1.5">
                      Try again
                    </button>
                  </>
                )}
              </div>
            </div>
            <button onClick={dismissLocationPrompt} className="btn-ghost p-1">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="card p-5">
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
              placeholder="DTW" className="input font-mono" />
            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <SuggestionDropdown suggestions={destinationSuggestions} onSelect={handleSelectDestination} />
            )}
          </div>
          <div>
            <label className="label">Stops</label>
            <select value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value as StopsFilter)} className="input">
              <option value="cheapest">Cheapest</option>
              <option value="0">Nonstop</option>
              <option value="1">1 Stop</option>
              <option value="2">2 Stops</option>
              <option value="3+">3+ Stops</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={handleUpdate} disabled={isLoading || isSearching}
              className="btn-primary w-full">
              {isLoading ? 'Loading...' : 'Update'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <a href={googleFlightsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
            <ExternalLinkIcon className="h-3 w-3" /> Compare on Google Flights
          </a>
          <ProposeTripModal
            trigger={
              <button className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
                Propose This Trip
              </button>
            }
            defaultOrigin={origin}
            defaultDestination={destination}
            defaultPrice={lowestPrice}
          />
        </div>

        <div className="border-b border-[var(--border)]">
          <nav className="flex -mb-px">
            {chartTypes.map((type, index) => (
              <button key={type} onClick={() => setTabValue(index)}
                className={`py-2 px-3 text-xs font-medium border-b-2 -mb-px transition-colors ${
                  tabValue === index
                    ? 'border-[var(--foreground)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
                type="button">
                {chartTitles[index]}
              </button>
            ))}
          </nav>
        </div>

        {chartTypes.map((type, index) => (
          <div key={type} className={`pt-4 ${tabValue === index ? 'block' : 'hidden'}`}>
            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-5 w-5 text-[var(--muted)] animate-spin" />
                </div>
              ) : error ? (
                <div className="p-3 bg-[var(--destructive-bg)] text-[var(--destructive)] rounded-md text-xs">
                  {error}
                </div>
              ) : filteredPrices.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-[var(--muted)]">
                  No flights found with {stopsFilter === '0' ? 'nonstop' : stopsFilter === '3+' ? '3+ stops' : `${stopsFilter} stop${stopsFilter === '1' ? '' : 's'}`}
                </div>
              ) : (
                <PriceHistoryChart prices={filteredPrices} loading={isLoading} chartType={type} title={chartTitles[index]} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
