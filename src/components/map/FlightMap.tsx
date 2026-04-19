import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  MockDataset,
  routePriceStats,
} from '../../mocks/mockData';
import { greatCirclePoints } from './greatCircle';

interface FlightMapProps {
  dataset: MockDataset;
  takenAt: string;
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

// Color scale: cheap (teal) → median (amber) → expensive (rose).
function priceColor(current: number | null, p10: number, p90: number): string {
  if (current == null || p90 === p10) return '#64748b';
  const t = Math.min(1, Math.max(0, (current - p10) / (p90 - p10)));
  // interpolate teal -> amber -> rose
  const stops = [
    { t: 0,   c: [20, 184, 166] },   // teal-500
    { t: 0.5, c: [245, 158, 11] },   // amber-500
    { t: 1,   c: [244, 63, 94]  },   // rose-500
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const k = (t - lo.t) / (hi.t - lo.t || 1);
  const rgb = lo.c.map((v, i) => Math.round(v + (hi.c[i] - v) * k));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, bounds]);
  return null;
}

export default function FlightMap({
  dataset,
  takenAt,
  selectedRouteId,
  onSelectRoute,
}: FlightMapProps) {
  // compute arcs + price stats per route
  const arcs = useMemo(() => {
    return dataset.routes.map(route => {
      const pts = greatCirclePoints(
        [route.origin.lat, route.origin.lon],
        [route.destination.lat, route.destination.lon],
        48
      );
      const stats = routePriceStats(dataset, route.id, takenAt);
      return { route, pts, stats };
    });
  }, [dataset, takenAt]);

  const airports = useMemo(() => {
    const m = new Map<string, typeof dataset.routes[number]['origin']>();
    for (const r of dataset.routes) {
      m.set(r.origin.code, r.origin);
      m.set(r.destination.code, r.destination);
    }
    return Array.from(m.values());
  }, [dataset]);

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    const lats = airports.map(a => a.lat);
    const lons = airports.map(a => a.lon);
    return [[Math.min(...lats), Math.min(...lons)], [Math.max(...lats), Math.max(...lons)]];
  }, [airports]);

  // Animate a plane icon along each arc. We store an "offset" ref and tick.
  const tickRef = useRef(0);
  const planePosRef = useRef<Map<string, number>>(new Map());
  // trigger a re-render each animation frame by bumping state via refs is
  // overkill — instead animate marker offset purely via DOM position style.
  // Here we skip real animation for simplicity; the arcs themselves carry
  // the visual weight. (Animation ready to slot into M3.)
  void tickRef; void planePosRef;

  return (
    <MapContainer
      center={[41, -85]}
      zoom={5}
      style={{ height: '100%', width: '100%', background: '#0b1220' }}
      scrollWheelZoom
    >
      <FitBounds bounds={bounds} />
      <TileLayer
        attribution='&copy; OpenStreetMap, &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {arcs.map(({ route, pts, stats }) => {
        const color = priceColor(stats.current, stats.p10, stats.p90);
        const isSelected = selectedRouteId === route.id;
        return (
          <Polyline
            key={route.id}
            positions={pts}
            pathOptions={{
              color,
              weight: isSelected ? 4 : 2.5,
              opacity: isSelected ? 1 : 0.75,
              dashArray: route.nonstopOnly ? undefined : '6 6',
            }}
            eventHandlers={{ click: () => onSelectRoute(route.id) }}
          >
            <Tooltip sticky>
              <div style={{ fontSize: 12 }}>
                <div style={{ fontWeight: 600 }}>
                  {route.origin.code} → {route.destination.code}
                </div>
                <div>now: {stats.current != null ? `$${stats.current}` : '—'}</div>
                <div style={{ opacity: 0.75 }}>
                  7-day median ${Math.round(stats.median)} · band ${Math.round(stats.p10)}–${Math.round(stats.p90)}
                </div>
                {!route.nonstopOnly && (
                  <div style={{ opacity: 0.75, marginTop: 2 }}>(connection common)</div>
                )}
              </div>
            </Tooltip>
          </Polyline>
        );
      })}

      {airports.map(a => (
        <CircleMarker
          key={a.code}
          center={[a.lat, a.lon]}
          radius={5}
          pathOptions={{ color: '#e2e8f0', fillColor: '#f8fafc', fillOpacity: 1, weight: 1.5 }}
        >
          <Tooltip direction="top" offset={[0, -6]} permanent>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{a.code}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
