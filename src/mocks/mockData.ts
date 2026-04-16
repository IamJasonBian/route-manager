// Deterministic mock data for the flight map MVP.
// Shape mirrors the target schema in SCOPE_PLAN.md: monitored_route,
// flight_schedule, snapshot, next_departures.

export interface Airport {
  code: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
}

export interface MonitoredRoute {
  id: string;
  origin: Airport;
  destination: Airport;
  nonstopOnly: boolean;
}

export interface ScheduledFlight {
  id: string;
  routeId: string;
  carrier: string;
  flightNumber: string;
  scheduledDeparture: string; // ISO
  scheduledArrival: string;   // ISO
  aircraft: string;
}

export interface Snapshot {
  takenAt: string;           // ISO, hour bucket
  flightId: string;
  priceCents: number;
  seatsRemaining: number;
  cabin: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS';
}

export const AIRPORTS: Record<string, Airport> = {
  JFK: { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', lat: 40.6413, lon: -73.7781 },
  LGA: { code: 'LGA', name: 'LaGuardia',            city: 'New York', lat: 40.7769, lon: -73.8740 },
  EWR: { code: 'EWR', name: 'Newark Liberty Intl',  city: 'Newark',   lat: 40.6895, lon: -74.1745 },
  DTW: { code: 'DTW', name: 'Detroit Metro Wayne',  city: 'Detroit',  lat: 42.2124, lon: -83.3534 },
  GRR: { code: 'GRR', name: 'Gerald R. Ford Intl',  city: 'Grand Rapids', lat: 42.8808, lon: -85.5228 },
  ORD: { code: 'ORD', name: "O'Hare Intl",          city: 'Chicago',  lat: 41.9742, lon: -87.9073 },
  BOS: { code: 'BOS', name: 'Logan Intl',           city: 'Boston',   lat: 42.3656, lon: -71.0096 },
  SFO: { code: 'SFO', name: 'San Francisco Intl',   city: 'San Francisco', lat: 37.6213, lon: -122.3790 },
};

export const MONITORED_ROUTES: MonitoredRoute[] = [
  { id: 'JFK-DTW', origin: AIRPORTS.JFK, destination: AIRPORTS.DTW, nonstopOnly: true },
  { id: 'LGA-DTW', origin: AIRPORTS.LGA, destination: AIRPORTS.DTW, nonstopOnly: true },
  { id: 'EWR-DTW', origin: AIRPORTS.EWR, destination: AIRPORTS.DTW, nonstopOnly: true },
  { id: 'JFK-GRR', origin: AIRPORTS.JFK, destination: AIRPORTS.GRR, nonstopOnly: false }, // seasonal / rare nonstop
  { id: 'JFK-ORD', origin: AIRPORTS.JFK, destination: AIRPORTS.ORD, nonstopOnly: true },
  { id: 'JFK-BOS', origin: AIRPORTS.JFK, destination: AIRPORTS.BOS, nonstopOnly: true },
  { id: 'JFK-SFO', origin: AIRPORTS.JFK, destination: AIRPORTS.SFO, nonstopOnly: true },
];

// Mulberry32 PRNG — deterministic per-seed so every render gets the same mock
function seeded(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Carrier preference per route (not exhaustive — just plausible)
const ROUTE_CARRIERS: Record<string, string[]> = {
  'JFK-DTW': ['DL', 'AA'],
  'LGA-DTW': ['DL'],
  'EWR-DTW': ['UA', 'DL'],
  'JFK-GRR': ['DL'],          // usually connects, mock shows a daily nonstop
  'JFK-ORD': ['AA', 'UA', 'DL'],
  'JFK-BOS': ['B6', 'DL', 'AA'],
  'JFK-SFO': ['B6', 'AA', 'DL', 'UA'],
};

const DURATION_MIN: Record<string, number> = {
  'JFK-DTW': 110, 'LGA-DTW': 110, 'EWR-DTW': 110,
  'JFK-GRR': 135, 'JFK-ORD': 160, 'JFK-BOS': 75, 'JFK-SFO': 380,
};

// Typical basefare per route (USD)
const BASE_FARE_USD: Record<string, number> = {
  'JFK-DTW': 215, 'LGA-DTW': 225, 'EWR-DTW': 205,
  'JFK-GRR': 340, 'JFK-ORD': 185, 'JFK-BOS': 145, 'JFK-SFO': 295,
};

// Departure-hour distribution: peaks morning & evening, thin overnight.
// Weighted buckets, 24 entries.
const HOUR_WEIGHTS = [
  0, 0, 0, 0, 0,            // 00-04
  1, 3, 5, 6, 5, 4, 3,      // 05-11
  3, 4, 4, 3, 4, 5, 4, 3,   // 12-19
  2, 1, 1, 0,               // 20-23
];

function pickWeighted(rng: () => number, weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function routeHash(routeId: string): number {
  let h = 2166136261;
  for (let i = 0; i < routeId.length; i++) {
    h ^= routeId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface MockDataset {
  now: Date;
  routes: MonitoredRoute[];
  flights: ScheduledFlight[];
  snapshots: Snapshot[];
}

// Build 14 days of schedule centered on `now`, and hourly snapshots for the
// last `snapshotHours` hours.
export function generateMockData(
  now: Date = new Date(),
  opts: { daysPast?: number; daysFuture?: number; snapshotHours?: number } = {}
): MockDataset {
  const daysPast = opts.daysPast ?? 3;
  const daysFuture = opts.daysFuture ?? 10;
  const snapshotHours = opts.snapshotHours ?? 72;

  const flights: ScheduledFlight[] = [];
  const snapshots: Snapshot[] = [];

  for (const route of MONITORED_ROUTES) {
    const rng = seeded(routeHash(route.id));
    const carriers = ROUTE_CARRIERS[route.id];
    const dur = DURATION_MIN[route.id];

    // flights per day varies 4..10 based on route popularity
    const flightsPerDay = route.id === 'JFK-GRR' ? 2 : Math.floor(4 + rng() * 6);

    for (let d = -daysPast; d <= daysFuture; d++) {
      const day = new Date(now);
      day.setDate(day.getDate() + d);
      day.setHours(0, 0, 0, 0);

      // each flight "number" is stable across days for same slot
      for (let slot = 0; slot < flightsPerDay; slot++) {
        const carrier = carriers[slot % carriers.length];
        const flightNumber = `${carrier}${1000 + ((routeHash(route.id + slot) % 8999))}`;
        const hour = pickWeighted(rng, HOUR_WEIGHTS);
        const minute = Math.floor(rng() * 12) * 5;

        const dep = new Date(day);
        dep.setHours(hour, minute, 0, 0);
        const arr = new Date(dep.getTime() + dur * 60_000);

        flights.push({
          id: `${route.id}-${dep.toISOString()}-${flightNumber}`,
          routeId: route.id,
          carrier,
          flightNumber,
          scheduledDeparture: dep.toISOString(),
          scheduledArrival: arr.toISOString(),
          aircraft: slot % 2 === 0 ? '738' : 'A320',
        });
      }
    }

    // snapshots: for the last snapshotHours hours, each hour bucket records
    // a price per upcoming flight departing within the next 48h from that bucket.
    for (let h = snapshotHours - 1; h >= 0; h--) {
      const takenAt = new Date(now);
      takenAt.setMinutes(0, 0, 0);
      takenAt.setHours(takenAt.getHours() - h);

      const windowStart = takenAt.getTime();
      const windowEnd = windowStart + 48 * 3600 * 1000;

      const baseFare = BASE_FARE_USD[route.id];
      for (const f of flights) {
        if (f.routeId !== route.id) continue;
        const depMs = new Date(f.scheduledDeparture).getTime();
        if (depMs < windowStart || depMs > windowEnd) continue;

        const hoursTilDep = (depMs - windowStart) / 3600000;
        // price curve: cheaper ~12-24h out, spikes inside 6h
        let multiplier = 1.0;
        if (hoursTilDep < 6) multiplier = 1.6 + rng() * 0.3;
        else if (hoursTilDep < 12) multiplier = 1.25 + rng() * 0.2;
        else if (hoursTilDep < 24) multiplier = 0.85 + rng() * 0.2;
        else if (hoursTilDep < 36) multiplier = 0.95 + rng() * 0.25;
        else multiplier = 1.05 + rng() * 0.3;

        // hour-of-day premium: red-eye cheaper, peak-business pricier
        const depHour = new Date(depMs).getHours();
        if (depHour >= 7 && depHour <= 9) multiplier *= 1.15;
        if (depHour >= 17 && depHour <= 19) multiplier *= 1.12;
        if (depHour >= 22 || depHour <= 5) multiplier *= 0.85;

        // jitter per snapshot hour to simulate volatility
        multiplier *= 0.95 + rng() * 0.1;

        const price = Math.round(baseFare * multiplier);
        snapshots.push({
          takenAt: takenAt.toISOString(),
          flightId: f.id,
          priceCents: price * 100,
          seatsRemaining: Math.max(0, Math.floor(40 - hoursTilDep * 0.3 - rng() * 10)),
          cabin: 'ECONOMY',
        });
      }
    }
  }

  return { now, routes: MONITORED_ROUTES, flights, snapshots };
}

// Query helpers the UI uses.

export function snapshotHours(ds: MockDataset): string[] {
  const set = new Set(ds.snapshots.map(s => s.takenAt));
  return Array.from(set).sort();
}

// Latest snapshot price for a flight at or before `takenAt`.
export function priceAt(
  ds: MockDataset,
  flightId: string,
  takenAt: string
): Snapshot | undefined {
  const target = new Date(takenAt).getTime();
  let best: Snapshot | undefined;
  for (const s of ds.snapshots) {
    if (s.flightId !== flightId) continue;
    const t = new Date(s.takenAt).getTime();
    if (t <= target && (!best || t > new Date(best.takenAt).getTime())) best = s;
  }
  return best;
}

// Next N flights after `takenAt` for a route, with their price at that snapshot.
export interface NextDeparture {
  flight: ScheduledFlight;
  snapshot?: Snapshot;
  minutesUntil: number;
}

export function nextDepartures(
  ds: MockDataset,
  routeId: string,
  takenAt: string,
  limit = 5
): NextDeparture[] {
  const now = new Date(takenAt).getTime();
  const upcoming = ds.flights
    .filter(f => f.routeId === routeId && new Date(f.scheduledDeparture).getTime() >= now)
    .sort((a, b) => new Date(a.scheduledDeparture).getTime() - new Date(b.scheduledDeparture).getTime())
    .slice(0, limit);
  return upcoming.map(f => ({
    flight: f,
    snapshot: priceAt(ds, f.id, takenAt),
    minutesUntil: Math.round((new Date(f.scheduledDeparture).getTime() - now) / 60000),
  }));
}

// Median price for a route across the last `hours` of snapshots.
export function routePriceStats(
  ds: MockDataset,
  routeId: string,
  takenAt: string,
  lookbackHours = 24 * 7
): { median: number; p10: number; p90: number; current: number | null } {
  const end = new Date(takenAt).getTime();
  const start = end - lookbackHours * 3600 * 1000;
  const flightIds = new Set(ds.flights.filter(f => f.routeId === routeId).map(f => f.id));
  const prices: number[] = [];
  for (const s of ds.snapshots) {
    if (!flightIds.has(s.flightId)) continue;
    const t = new Date(s.takenAt).getTime();
    if (t >= start && t <= end) prices.push(s.priceCents / 100);
  }
  prices.sort((a, b) => a - b);
  const q = (p: number) => prices.length ? prices[Math.floor((prices.length - 1) * p)] : 0;

  // "current" = cheapest snapshot at takenAt across route's flights
  const currentPrices = ds.snapshots
    .filter(s => flightIds.has(s.flightId) && s.takenAt === takenAt)
    .map(s => s.priceCents / 100);
  const current = currentPrices.length ? Math.min(...currentPrices) : null;

  return { median: q(0.5), p10: q(0.1), p90: q(0.9), current };
}

// Hour-of-day × day heatmap data for a route.
export function hourOfDayHeatmap(
  ds: MockDataset,
  routeId: string,
  takenAt: string
): { day: string; hour: number; medianPrice: number; count: number }[] {
  const flightIds = new Set(ds.flights.filter(f => f.routeId === routeId).map(f => f.id));
  const flightById = new Map(ds.flights.map(f => [f.id, f]));
  // only use the latest snapshot per flight at/before takenAt
  const latestByFlight = new Map<string, Snapshot>();
  for (const s of ds.snapshots) {
    if (!flightIds.has(s.flightId)) continue;
    if (s.takenAt > takenAt) continue;
    const prev = latestByFlight.get(s.flightId);
    if (!prev || s.takenAt > prev.takenAt) latestByFlight.set(s.flightId, s);
  }
  const bucket = new Map<string, number[]>();
  for (const [fid, s] of latestByFlight) {
    const f = flightById.get(fid)!;
    const d = new Date(f.scheduledDeparture);
    const day = d.toISOString().slice(0, 10);
    const hour = d.getHours();
    const key = `${day}|${hour}`;
    if (!bucket.has(key)) bucket.set(key, []);
    bucket.get(key)!.push(s.priceCents / 100);
  }
  const out: { day: string; hour: number; medianPrice: number; count: number }[] = [];
  for (const [key, prices] of bucket) {
    const [day, hourStr] = key.split('|');
    prices.sort((a, b) => a - b);
    out.push({
      day,
      hour: Number(hourStr),
      medianPrice: prices[Math.floor((prices.length - 1) / 2)],
      count: prices.length,
    });
  }
  return out;
}
