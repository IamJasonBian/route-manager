// Live transport estimates from a user's coordinates to a destination.
// Uses the public OSRM demo router for real road/path routing, with a
// haversine-based fallback when the network call fails or rate-limits.

export type TransportMode = 'driving' | 'cycling' | 'walking';

export interface TransportEstimate {
  mode: TransportMode | 'transit' | 'rideshare';
  label: string;
  icon: string;
  distanceMeters: number;
  durationSeconds: number;
  source: 'osrm' | 'estimate';
  costEstimateUsd?: number;
}

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

// Average speeds (m/s) used for the haversine fallback. These match
// typical real-world averages including stops and traffic.
const FALLBACK_SPEEDS: Record<TransportMode, number> = {
  driving: 13.4,  // ~30 mph including urban + highway mix
  cycling: 4.5,   // ~10 mph
  walking: 1.35,  // ~3 mph
};

// Path multipliers applied to great-circle distance to approximate real
// route length when OSRM is unavailable.
const PATH_MULTIPLIERS: Record<TransportMode, number> = {
  driving: 1.3,
  cycling: 1.25,
  walking: 1.2,
};

export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function fetchOsrm(
  mode: TransportMode,
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  signal?: AbortSignal
): Promise<{ distanceMeters: number; durationSeconds: number } | null> {
  const url = `${OSRM_BASE}/${mode}/${fromLon},${fromLat};${toLon},${toLat}?overview=false`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;
    return {
      distanceMeters: route.distance,
      durationSeconds: route.duration,
    };
  } catch {
    return null;
  }
}

function fallbackEstimate(
  mode: TransportMode,
  straightLineMeters: number
): { distanceMeters: number; durationSeconds: number } {
  const distanceMeters = straightLineMeters * PATH_MULTIPLIERS[mode];
  const durationSeconds = distanceMeters / FALLBACK_SPEEDS[mode];
  return { distanceMeters, durationSeconds };
}

async function getMode(
  mode: TransportMode,
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  signal?: AbortSignal
): Promise<{ distanceMeters: number; durationSeconds: number; source: 'osrm' | 'estimate' }> {
  const osrm = await fetchOsrm(mode, fromLat, fromLon, toLat, toLon, signal);
  if (osrm) return { ...osrm, source: 'osrm' };
  const straight = haversineMeters(fromLat, fromLon, toLat, toLon);
  return { ...fallbackEstimate(mode, straight), source: 'estimate' };
}

// Rough rideshare cost: base + per-mile + per-minute. Tuned for US averages.
function estimateRideshareCost(distanceMeters: number, durationSeconds: number): number {
  const miles = distanceMeters / 1609.344;
  const minutes = durationSeconds / 60;
  return Math.round(3 + miles * 1.6 + minutes * 0.35);
}

// Transit estimate is derived from the driving route by applying a
// realistic multiplier — public transit typically runs ~1.4-1.8x driving
// time including transfers and walking legs.
function deriveTransitEstimate(
  driving: { distanceMeters: number; durationSeconds: number }
): { distanceMeters: number; durationSeconds: number } {
  return {
    distanceMeters: driving.distanceMeters * 1.05,
    durationSeconds: driving.durationSeconds * 1.6 + 600,
  };
}

export async function getTransportEstimates(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  signal?: AbortSignal
): Promise<TransportEstimate[]> {
  const [driving, cycling, walking] = await Promise.all([
    getMode('driving', fromLat, fromLon, toLat, toLon, signal),
    getMode('cycling', fromLat, fromLon, toLat, toLon, signal),
    getMode('walking', fromLat, fromLon, toLat, toLon, signal),
  ]);

  const transit = deriveTransitEstimate(driving);

  const estimates: TransportEstimate[] = [
    {
      mode: 'driving',
      label: 'Drive',
      icon: '🚗',
      distanceMeters: driving.distanceMeters,
      durationSeconds: driving.durationSeconds,
      source: driving.source,
    },
    {
      mode: 'rideshare',
      label: 'Rideshare',
      icon: '🚕',
      distanceMeters: driving.distanceMeters,
      durationSeconds: driving.durationSeconds + 300, // ~5 min pickup wait
      source: driving.source,
      costEstimateUsd: estimateRideshareCost(
        driving.distanceMeters,
        driving.durationSeconds
      ),
    },
    {
      mode: 'transit',
      label: 'Transit',
      icon: '🚆',
      distanceMeters: transit.distanceMeters,
      durationSeconds: transit.durationSeconds,
      source: 'estimate',
    },
    {
      mode: 'cycling',
      label: 'Bike',
      icon: '🚴',
      distanceMeters: cycling.distanceMeters,
      durationSeconds: cycling.durationSeconds,
      source: cycling.source,
    },
    {
      mode: 'walking',
      label: 'Walk',
      icon: '🚶',
      distanceMeters: walking.distanceMeters,
      durationSeconds: walking.durationSeconds,
      source: walking.source,
    },
  ];

  return estimates;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins === 0 ? `${hours}h` : `${hours}h ${remMins}m`;
}

export function formatDistanceMiles(meters: number): string {
  const miles = meters / 1609.344;
  if (miles < 0.1) return `${Math.round(meters)} m`;
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}
