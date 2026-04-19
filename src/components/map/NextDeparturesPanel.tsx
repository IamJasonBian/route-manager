import { useMemo } from 'react';
import {
  MockDataset,
  nextDepartures,
  routePriceStats,
} from '../../mocks/mockData';

interface Props {
  dataset: MockDataset;
  takenAt: string;
  routeId: string | null;
}

function fmtClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function fmtDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function minutesLabel(mins: number): string {
  if (mins < 60) return `in ${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return `in ${h}h ${m}m`;
  const d = Math.floor(h / 24);
  return `in ${d}d ${h % 24}h`;
}

export default function NextDeparturesPanel({ dataset, takenAt, routeId }: Props) {
  const route = useMemo(
    () => dataset.routes.find(r => r.id === routeId) || null,
    [dataset, routeId]
  );
  const deps = useMemo(
    () => routeId ? nextDepartures(dataset, routeId, takenAt, 6) : [],
    [dataset, routeId, takenAt]
  );
  const stats = useMemo(
    () => routeId ? routePriceStats(dataset, routeId, takenAt) : null,
    [dataset, routeId, takenAt]
  );

  if (!route) {
    return (
      <div className="p-6 text-sm text-slate-400">
        <p>Click a route on the map.</p>
        <p className="mt-2 opacity-60">Dashed arcs indicate routes that typically connect.</p>
      </div>
    );
  }

  const priceTag = (price: number | undefined) => {
    if (price == null || !stats) return null;
    const delta = stats.median ? (price - stats.median) / stats.median : 0;
    const cls = delta <= -0.1 ? 'text-teal-300'
              : delta >= 0.15 ? 'text-rose-300'
              : 'text-amber-300';
    const badge = delta <= -0.1 ? 'below median'
                : delta >= 0.15 ? 'above median'
                : 'near median';
    return (
      <div className="text-right">
        <div className={`text-lg font-semibold ${cls}`}>${price}</div>
        <div className="text-[10px] uppercase tracking-wide opacity-60">{badge}</div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 text-slate-100">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest opacity-60">Monitored route</div>
        <h2 className="text-2xl font-bold">
          {route.origin.code}
          <span className="mx-2 opacity-60">→</span>
          {route.destination.code}
        </h2>
        <div className="text-sm opacity-70">
          {route.origin.city} to {route.destination.city}
          {!route.nonstopOnly && <span className="ml-2 text-amber-300">(nonstop rare)</span>}
        </div>
      </div>

      {stats && (
        <div className="mb-6 rounded-lg border border-slate-700/60 bg-slate-800/40 p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60">Now</div>
              <div className="text-3xl font-bold">
                {stats.current != null ? `$${stats.current}` : '—'}
              </div>
            </div>
            <div className="text-right text-xs opacity-70">
              <div>7d median ${Math.round(stats.median)}</div>
              <div>band ${Math.round(stats.p10)}–${Math.round(stats.p90)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest opacity-60">Next takeable flights</div>
        <div className="text-xs opacity-50">as of {fmtClock(takenAt)}</div>
      </div>

      <div className="space-y-2">
        {deps.length === 0 && (
          <div className="rounded-md border border-slate-700/60 bg-slate-800/30 p-4 text-sm opacity-70">
            No flights departing in the look-ahead window.
          </div>
        )}
        {deps.map(({ flight, snapshot, minutesUntil }) => {
          const price = snapshot ? snapshot.priceCents / 100 : undefined;
          return (
            <div
              key={flight.id}
              className="flex items-center justify-between rounded-md border border-slate-700/60 bg-slate-800/30 p-3 hover:bg-slate-800/60"
            >
              <div>
                <div className="font-semibold">
                  {flight.flightNumber}
                  <span className="ml-2 text-xs font-normal opacity-60">{flight.aircraft}</span>
                </div>
                <div className="text-sm">
                  {fmtClock(flight.scheduledDeparture)}
                  <span className="mx-1 opacity-60">→</span>
                  {fmtClock(flight.scheduledArrival)}
                </div>
                <div className="text-[11px] opacity-60">
                  {fmtDateShort(flight.scheduledDeparture)} · {minutesLabel(minutesUntil)}
                  {snapshot && ` · ${snapshot.seatsRemaining} seats`}
                </div>
              </div>
              {priceTag(price)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
