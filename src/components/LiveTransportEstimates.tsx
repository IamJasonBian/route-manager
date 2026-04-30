import { useCallback, useEffect, useRef, useState } from 'react';
import {
  TransportEstimate,
  formatDistanceMiles,
  formatDuration,
  getTransportEstimates,
} from '../services/transportService';

interface AirportLocation {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

interface LiveTransportEstimatesProps {
  destination: AirportLocation;
}

interface UserLocation {
  lat: number;
  lon: number;
  accuracyMeters: number;
  capturedAt: number;
}

const REFRESH_INTERVAL_MS = 60_000;

export default function LiveTransportEstimates({ destination }: LiveTransportEstimatesProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [estimates, setEstimates] = useState<TransportEstimate[] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<number | null>(null);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (refreshTimerRef.current !== null) {
      window.clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setIsLocating(false);
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          capturedAt: position.timestamp,
        });
      },
      (err) => {
        setIsLocating(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Allow access to see live estimates.'
            : 'Could not determine your location.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 }
    );
  }, []);

  useEffect(() => {
    return () => stopWatching();
  }, [stopWatching]);

  const fetchEstimates = useCallback(
    async (loc: UserLocation) => {
      setIsLoadingEstimates(true);
      const controller = new AbortController();
      try {
        const result = await getTransportEstimates(
          loc.lat,
          loc.lon,
          destination.lat,
          destination.lon,
          controller.signal
        );
        setEstimates(result);
        setLastUpdated(Date.now());
        setError(null);
      } catch {
        setError('Failed to compute transport estimates.');
      } finally {
        setIsLoadingEstimates(false);
      }
    },
    [destination.lat, destination.lon]
  );

  useEffect(() => {
    if (!userLocation) return;
    fetchEstimates(userLocation);

    if (refreshTimerRef.current !== null) {
      window.clearInterval(refreshTimerRef.current);
    }
    refreshTimerRef.current = window.setInterval(() => {
      fetchEstimates(userLocation);
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [userLocation, fetchEstimates]);

  const fastest = estimates
    ? estimates.reduce((best, cur) =>
        cur.durationSeconds < best.durationSeconds ? cur : best
      )
    : null;

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900/60 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-cyan-200">
              Live transport to {destination.code}
            </h3>
            {userLocation && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {destination.name} · estimates from your current location
            {lastUpdatedLabel && ` · updated ${lastUpdatedLabel}`}
          </p>
        </div>
        <div className="flex gap-2">
          {!userLocation ? (
            <button
              onClick={startWatching}
              disabled={isLocating}
              className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 disabled:bg-cyan-400"
            >
              {isLocating ? 'Locating…' : 'Start tracking'}
            </button>
          ) : (
            <>
              <button
                onClick={() => fetchEstimates(userLocation)}
                disabled={isLoadingEstimates}
                className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
              >
                {isLoadingEstimates ? 'Refreshing…' : 'Refresh'}
              </button>
              <button
                onClick={() => {
                  stopWatching();
                  setUserLocation(null);
                  setEstimates(null);
                  setLastUpdated(null);
                }}
                className="inline-flex items-center rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}

      {!userLocation && !error && !isLocating && (
        <p className="mt-3 text-xs text-slate-500">
          Tap "Start tracking" to compare drive, transit, bike, and walk times from where
          you are right now to {destination.code}.
        </p>
      )}

      {userLocation && !estimates && isLoadingEstimates && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-white/5 bg-white/5"
            />
          ))}
        </div>
      )}

      {estimates && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {estimates.map((est) => {
            const isFastest = fastest && est.mode === fastest.mode;
            return (
              <div
                key={est.mode}
                className={`rounded-lg border p-3 transition ${
                  isFastest
                    ? 'border-emerald-400/40 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl" aria-hidden="true">
                    {est.icon}
                  </span>
                  {isFastest && (
                    <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-300">
                      Fastest
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs font-medium text-slate-300">{est.label}</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {formatDuration(est.durationSeconds)}
                </div>
                <div className="text-[11px] text-slate-400">
                  {formatDistanceMiles(est.distanceMeters)}
                  {est.costEstimateUsd !== undefined && ` · ~$${est.costEstimateUsd}`}
                </div>
                {est.source === 'estimate' && (
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                    estimate
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {userLocation && (
        <p className="mt-3 text-[10px] text-slate-500">
          Routing by OSRM · accuracy ±{Math.round(userLocation.accuracyMeters)}m · auto-refreshes every minute
        </p>
      )}
    </div>
  );
}
