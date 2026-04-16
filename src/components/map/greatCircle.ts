// Great-circle interpolation between two lat/lon points.
// Returns N points we can render as a Leaflet polyline; good enough for US-
// domestic arcs without pulling in @turf/turf.

type LL = [number, number]; // [lat, lon]

function toRad(d: number) { return (d * Math.PI) / 180; }
function toDeg(r: number) { return (r * 180) / Math.PI; }

export function greatCirclePoints(a: LL, b: LL, steps = 64): LL[] {
  const [lat1, lon1] = [toRad(a[0]), toRad(a[1])];
  const [lat2, lon2] = [toRad(b[0]), toRad(b[1])];

  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((lat2 - lat1) / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
    )
  );
  if (d === 0) return [a, b];

  const pts: LL[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    pts.push([toDeg(lat), toDeg(lon)]);
  }
  return pts;
}

// Midpoint (for positioning labels).
export function midpoint(a: LL, b: LL): LL {
  const pts = greatCirclePoints(a, b, 2);
  return pts[1];
}
