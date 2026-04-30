# Transportation API Integration Research

Research notes for adding live-location ground transportation estimates (Uber, Lyft, taxi, transit) to Apollo Flight Trader. The goal: when a user is planning or boarding a flight, surface the cost and ETA of getting to/from the airport from their current location with one click.

## Use cases this unlocks

1. **Airport-bound estimate** — "From your current location to JFK Terminal 4 it's $42–$58 Uber X, ETA 38 min."
2. **Fly-or-not break-even** — combine ground transport cost with flight price so total trip cost can be evaluated.
3. **Last-minute trigger** — if the live ride estimate stays under a threshold, the booking agent can auto-buy a flex ticket.
4. **Arrival hand-off** — once a flight lands, prefetch ride estimates from the destination airport to a saved address.

---

## 1. Getting the user's live location (client side)

The browser `Geolocation` API is the right primitive — no SDK needed and works in Vite/React out of the box.

```ts
// src/utils/geolocation.ts
export const getCurrentLocation = (): Promise<GeolocationCoordinates> =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      reject,
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  });
```

Notes:
- HTTPS only. Netlify already serves over HTTPS so all three environments are fine.
- `watchPosition` for live tracking — only worth it for an in-trip experience, not for one-off estimates.
- Permission denial is common; fall back to a manual address input + a geocoder (Mapbox, Google Geocoding, or free OSM Nominatim).
- For privacy-sensitive users, IP-based geolocation (e.g. ipinfo.io, MaxMind) gives city-level accuracy without a permission prompt — useful as a graceful fallback.

---

## 2. Rideshare APIs

### Uber

Uber publishes two relevant API surfaces. Both are OAuth 2.0, both can return price + ETA estimates.

| Surface | Endpoint(s) | Account needed | Notes |
|---|---|---|---|
| **Riders API** (legacy) | `GET /v1.2/estimates/price`, `GET /v1.2/estimates/time` | Uber developer app | Older, but simple. Returns price range and ETA per product (UberX, Black, etc.). Some endpoints marked deprecated; new versions live at `/v1/...` under newer paths. |
| **Guest Rides API** (Uber for Business) | `POST /v1/guests/trips/estimates` | Uber for Business org + approval | Modern path. Designed for booking on behalf of a guest who doesn't have Uber. Default rate limit 200/hr, increasable. Requires `guests.trips` scope. |

Auth model:
- App registration on developer.uber.com, OAuth 2.0 client credentials.
- During development, your dev account can call privileged scopes without whitelisting.
- **Going to production requires Uber approval** — they want screenshots/video of the integration plus a public privacy policy. Plan ~1–2 weeks.

What an estimate returns: price low/high, currency, surge multiplier, pickup ETA, product list (UberX, Comfort, XL, Black). If the dropoff is omitted, you only get pickup ETA — useful as a cheap "are cars available right now?" check.

Recommended path for us:
- **Phase 1**: use the public Riders price/time estimate endpoints in sandbox to prototype the UI.
- **Phase 2**: apply for Guest Rides API access if we want to actually book the ride from the app, not just estimate.

### Lyft

Lyft has historically offered a public Ride-sharing API with sandbox + live modes:
- `GET /v1/cost` — price estimate between two coordinates.
- `GET /v1/eta` — pickup ETA at a coordinate.
- `GET /v1/ridetypes` — available products.

Caveats:
- Their public developer program has been quiet for years and access for new apps may need to go through their support team. Treat Lyft as "nice to have, ask before integrating."
- Node SDK exists at github.com/lyft/lyft-node-sdk but is unmaintained — call REST directly.

### Bolt / Ola / Grab / DiDi

Region-specific. None offer a frictionless public estimate API. Most require a partnership agreement. Park these until product validates the airport-transport feature with Uber.

---

## 3. Estimating without the rideshare APIs

If approval timelines or rate limits are a problem, we can build a **synthetic estimate** from generic mapping APIs and a fare model. Useful when (a) Uber/Lyft is rate-limited, (b) the user's region isn't covered, (c) we want a cached/cheaper preview before hitting the rideshare API.

| Provider | Endpoint | Pricing | Notes |
|---|---|---|---|
| Google Maps Distance Matrix | `/maps/api/distancematrix/json` | $5 per 1k elements | Most accurate traffic. Expensive at rideshare scale (a 25×25 matrix is ~$3 per call). |
| HERE Matrix Routing | `/v8/matrix` | ~$4.60 CPM | Up to 10k×10k. Solid traffic data. |
| Mapbox Directions / Matrix | `/directions-matrix/v1` | $2 per 1k requests | Generous free tier. Good fit for our scale. |
| TravelTime | `/v4/time-filter` | Cheaper than Google | Time-budget queries (everywhere reachable in 30 min). |
| OSRM (self-hosted) | `/table/v1/...` | Free | OSS Routing Machine on our own infra. No real-time traffic. |
| Geoapify | various | Free tier + paid | Drop-in distance matrix replacement. |

Synthetic fare model:
```
estimate = base + per_mile * miles + per_min * minutes + booking_fee
```
Calibrate `base`, `per_mile`, `per_min` per market by sampling Uber's real estimates a handful of times and storing them. Won't capture surge, but gets us within ~15% for most rides — fine as a "preview" before the user clicks through.

---

## 4. Public transit + airport shuttles

For airport-bound trips, transit can beat rideshare on price by 5–10×. Worth surfacing.

- **Google Routes API** (`computeRoutes` with `TRANSIT` mode) — best coverage globally.
- **Transitland v2 / OpenTripPlanner** — open-source GTFS routing, free.
- **Citymapper API** — limited public access.
- Airport-specific shuttles (e.g. JFK AirTrain, LAX FlyAway) are usually in the GTFS feeds — no special integration needed.

---

## 5. Recommended architecture

Mirror the existing Amadeus pattern: a Netlify Function holds credentials, the React app calls our function, our function calls the upstream.

```
src/components/AirportTransport.tsx
        │
        ▼ POST /api/transport-estimate { from: {lat,lng}, to: airportIata }
netlify/functions/transport-estimate.js
        │
        ├──► Uber Riders API   (price, ETA)
        ├──► Lyft API          (price, ETA — if approved)
        └──► Mapbox Matrix     (fallback / synthetic estimate)
        │
        ▼ Normalized response { providers: [{name, low, high, eta, deepLink}] }
```

Suggested response shape:
```ts
type TransportEstimate = {
  provider: 'uber' | 'lyft' | 'taxi' | 'transit';
  product: string;            // 'UberX', 'Lyft Standard', 'Subway+AirTrain'
  priceLow: number;
  priceHigh: number;
  currency: string;           // ISO 4217
  etaSeconds: number | null;  // pickup ETA
  durationSeconds: number;    // full trip
  surgeMultiplier?: number;
  deepLink?: string;          // m.uber.com/?... so user can complete in app
  source: 'live' | 'synthetic';
};
```

Caching: estimates can be cached by `(roundedLat, roundedLng, airport, productSet)` for ~60s — cuts cost dramatically without hurting UX.

Env vars to add to Netlify:
- `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_SCOPES`
- `LYFT_CLIENT_ID`, `LYFT_CLIENT_SECRET` (if/when approved)
- `MAPBOX_TOKEN` (for matrix fallback + geocoding)

---

## 6. Phased rollout

1. **Spike (1–2 days)**: client-side `getCurrentLocation` + a `transport-estimate` function that only calls Mapbox Matrix and applies a synthetic fare model. Gives us a working "Get to airport" panel without any approvals.
2. **Uber sandbox (3–5 days)**: register an Uber developer app, wire the Riders price/time estimate endpoints in sandbox, plumb deep links so users can finish the booking in the Uber app.
3. **Uber production approval (1–2 weeks calendar)**: submit screenshots/video, add privacy policy, get whitelisted.
4. **Lyft + transit (later)**: add as parallel providers behind the same normalized response.
5. **Booking agent integration**: once Guest Rides API is approved, wire estimates into the rebooking/buying agent so it can autonomously book ground transport with the flight.

---

## 7. Open questions for product

- Do we want to *book* ground transport from inside the app, or just estimate + deep-link? (Booking = much more compliance work.)
- Do we need to support international rideshare (Bolt/Grab/DiDi), or is US/Canada enough for v1?
- Privacy posture: are we OK storing user GPS coordinates server-side for caching / analytics, or should the function be stateless?
- Is the "synthetic Mapbox-based estimate" acceptable as a permanent fallback, or only as a stop-gap until Uber approval?

---

## References

- Uber Riders API — Price Estimates: https://developer.uber.com/docs/v1-estimates-price
- Uber Riders API — Time Estimates: https://developer.uber.com/docs/v1-estimates-time
- Uber Guest Rides — Trip Estimates: https://developer.uber.com/docs/guest-rides/references/api/v1/guest-trips-estimates-post
- Uber Guest Rides — Build Guide: https://developer.uber.com/docs/guest-rides/guest-ride-api-build-guide/overview
- Uber Riders — Scopes & approval: https://developer.uber.com/docs/riders/guides/scopes
- Lyft Developers: https://www.lyft.com/developers
- Lyft Node SDK: https://github.com/lyft/lyft-node-sdk
- MDN Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- Google Distance Matrix: https://developers.google.com/maps/documentation/distance-matrix/overview
- HERE Matrix Routing: https://developer.here.com/documentation/matrix-routing-api
- Mapbox Matrix API: https://docs.mapbox.com/api/navigation/matrix/
- OSRM Table API: https://blog.afi.io/blog/osrm-table-api-free-and-open-source-distance-matrix-api/
- Geoapify alternative: https://www.geoapify.com/geoapify-as-an-alternative-to-google-maps-api-distance-matrix/
