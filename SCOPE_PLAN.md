# Route Manager Rewrite — Scope & Plan

Branch: `claude/plan-flight-map-redesign-dwT5u`
Author: planning doc, not implementation

## Goal

Replace the current "generic price chart" UX with a **flight-history map** for a
small set of monitored nonstop routes (NYC→DTW, NYC→GRR, …) that publishes an
**hourly forecast snapshot** every day: _"at this hour, these are the next
flights you could actually take."_

This doc scopes what to keep, what to rewrite, what to throw away, and names
the decisions that need a human call before implementation starts.

---

## 1. Honest audit of the current codebase

What exists today (`src/`, `netlify/functions/`, `common/`):

| Layer        | State                                                        | Verdict               |
| ------------ | ------------------------------------------------------------ | --------------------- |
| UI shell     | React 18 + Vite + react-router, 3 pages                      | Keep structure, prune |
| Charts       | 5 chart components (PriceChart, PriceHistoryChart, Combined, CustomXAxis, UniqueKeyXAxis) using both Recharts and Chart.js | Collapse to one       |
| Map          | **Does not exist**                                           | Net-new               |
| Data source  | Amadeus `flightOffersSearch`, called per-date in a loop with 200ms sleep | Replace / supplement  |
| Persistence  | Postgres `routes` + `price_history(route_id, price, recorded_at)` | Schema too thin       |
| Snapshotting | JSON files in `data/snapshots/` (date → price only, no time, no carrier, no flight#) | Throw away            |
| Scheduling   | None — prices are fetched on-demand per page load            | Net-new (cron)        |
| `common/`    | Parallel JSX demo app (`App.jsx`, `price-history-chart.js`, `serve-demo.js`) | Delete                |
| Fallbacks    | Mock data silently substituted when API fails (`api.ts:215`, `flight-prices.js:195`) | Remove — hides bugs   |
| Tests        | Jest setup exists, coverage near zero                        | Add as we go          |

**Biggest structural problem:** there is no concept of a _flight_ as a
time-stamped, carrier-keyed entity that persists across snapshots. Everything
is "min price for route on date X." That cannot answer "what's the next
flight I could take from JFK right now?"

## 2. Framework decision — Svelte vs stay on React

You asked about SvelteKit. Honest take:

**Recommendation: stay on React + Vite. Do not rewrite to SvelteKit.**

Reasons:

- The UI-layer cost here is small — one map page, one detail drawer, a time
  scrubber. SvelteKit's bundle/ergonomics win is real but marginal at this
  size.
- The current pain is **data pipeline + snapshot model + map**, not the
  framework. A rewrite to Svelte drags the whole Radix/shadcn/Tailwind stack
  along with it and delays the actual feature.
- Netlify Functions + SvelteKit adapter works but you lose the
  `netlify/functions/*.js` path you already have wired up.

Where SvelteKit _would_ win: if we also wanted SSR'd share links
(`/routes/JFK-DTW/2026-04-16T14` rendered server-side for rich previews).
That's a "nice to have," not a driver.

Counter-plan if we do want Svelte: greenfield `/web-v2` as SvelteKit app, keep
the Netlify Functions, ship map page first, migrate other pages later. Still
not recommending it — flagged for explicit choice.

## 3. Data source — Google Flights vs Amadeus

You said "use Google Flights." Google does **not** publish a flight API
(QPX Express retired 2018). Options:

| Source                    | Cost              | Reliability         | Legal / ToS risk        | Fit for hourly cron |
| ------------------------- | ----------------- | ------------------- | ----------------------- | ------------------- |
| Amadeus (current)         | Metered, stable   | High                | None                    | Good                |
| SerpAPI `google_flights`  | ~$50/mo entry     | High, SLA'd         | SerpAPI bears it        | Good                |
| `fast-flights` (py scrape)| Free              | Breaks periodically | Ambiguous; respect ToS  | Fragile             |
| Kiwi Tequila              | Free tier         | OK, not GFlights    | None                    | Good                |
| Skyscanner Partner        | Partner-only      | High                | Requires approval       | Good                |

**Recommendation:** keep Amadeus as the system-of-record for schedule/price,
add **SerpAPI google_flights** as an enrichment source for the exact fields
Amadeus is weak on (Google's "typical price" band, "best departing flights"
ranking). Abstract both behind one `FlightProvider` interface. Do not ship
unofficial scrapers to prod.

Decision needed from you: is the $50–$150/mo SerpAPI line acceptable? If not,
we stick to Amadeus only and drop "Google Flights" branding.

## 4. Monitored routes (initial set)

Start with 6–8 routes, all nonstop, revisable in config:

```
JFK ↔ DTW    LGA ↔ DTW    EWR ↔ DTW
JFK ↔ GRR    (NYC-area → Grand Rapids, likely 1-stop — flag honestly)
JFK ↔ ORD    JFK ↔ BOS    JFK ↔ SFO
```

Note: "NYC → GRR" nonstop is rare (Delta seasonally from LGA/JFK; usually
connects through DTW). The UI must be honest when nonstop doesn't exist at a
given hour rather than silently returning a 1-stop itinerary.

Config lives in `src/config/monitoredRoutes.ts` — one source of truth for
backend cron + frontend map.

## 5. Data model rewrite

Replace the current `routes` + `price_history` with a snapshot-native schema:

```sql
-- What we monitor
CREATE TABLE monitored_route (
  id           SERIAL PRIMARY KEY,
  origin       CHAR(3) NOT NULL,
  destination  CHAR(3) NOT NULL,
  nonstop_only BOOLEAN NOT NULL DEFAULT TRUE,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (origin, destination, nonstop_only)
);

-- One row per distinct (scheduled) flight we've ever seen.
-- Keyed by carrier + flight# + scheduled departure instant.
CREATE TABLE flight_schedule (
  id                   SERIAL PRIMARY KEY,
  route_id             INT REFERENCES monitored_route(id),
  carrier              VARCHAR(3) NOT NULL,
  flight_number        VARCHAR(8) NOT NULL,
  scheduled_departure  TIMESTAMPTZ NOT NULL,
  scheduled_arrival    TIMESTAMPTZ NOT NULL,
  aircraft_code        VARCHAR(8),
  UNIQUE (carrier, flight_number, scheduled_departure)
);

-- Hourly pull: for each flight we've been watching, what does it cost now?
CREATE TABLE snapshot (
  id                  SERIAL PRIMARY KEY,
  taken_at            TIMESTAMPTZ NOT NULL,          -- the hour bucket
  flight_schedule_id  INT REFERENCES flight_schedule(id),
  price_cents         INT,
  currency            CHAR(3) NOT NULL DEFAULT 'USD',
  cabin               VARCHAR(16),
  seats_remaining     INT,                           -- if provider exposes
  provider            VARCHAR(16) NOT NULL,          -- 'amadeus' | 'serpapi'
  raw                 JSONB                          -- keep provider payload
);
CREATE INDEX ON snapshot (taken_at);
CREATE INDEX ON snapshot (flight_schedule_id, taken_at DESC);

-- Derived: for a given (route, taken_at), the next N departable flights
-- ranked by departure time. Materialized by the cron so the frontend is dumb.
CREATE MATERIALIZED VIEW next_departures AS
  SELECT ... ;  -- spec'd during implementation
```

Why this shape:

- A snapshot is per-flight, per-hour. You can answer "price of DL123 at
  14:00 vs 15:00 today" and "what were the 5 next takeable JFK→DTW flights
  at 14:00 on Apr 16?"
- The current `price_history` (one min-price per day) is a lossy aggregate of
  this. We can keep a daily rollup view for backward compat.

## 6. Hourly forecast cron

Requirement: every hour, for each monitored route, record the "next takeable
flights" snapshot.

Implementation choices:

| Option                     | Pros                                | Cons                                     |
| -------------------------- | ----------------------------------- | ---------------------------------------- |
| Netlify Scheduled Functions| Zero infra, already on Netlify      | 10-sec exec cap; per-invocation timeout  |
| GitHub Actions cron        | Generous runtime, free              | Cron granularity is "best effort"        |
| AWS Lambda + EventBridge   | Clean, scales                       | Adds infra; `cdk/` dir already exists    |

**Recommendation:** GitHub Actions cron (`.github/workflows/hourly-snapshot.yml`)
invokes a `scripts/snapshotRoutes.ts` script that writes to Postgres. Netlify
scheduled functions are too restrictive for ~8 routes × 2 providers × retries
within the 10s cap. CDK path stays as a future option.

Snapshot algorithm (per run):

1. Load `monitored_route` where `active = true`.
2. For each route, ask each provider for flights departing within the next
   48 hours (configurable window).
3. Upsert into `flight_schedule` by `(carrier, flight_number,
   scheduled_departure)`.
4. Insert a `snapshot` row per flight with `taken_at = date_trunc('hour', now())`.
5. Refresh `next_departures` materialized view.

Expected volume: 8 routes × ~20 flights/route × 24 hrs/day ≈ 4k rows/day.
Cheap.

## 7. The flight-history map (the actual feature)

Page: `/map` (becomes the new home).

Layout:

```
┌─────────────────────────────────────────────────────────────┐
│  Route Manager         [time scrubber: ◀ 2026-04-16 14:00 ▶]│
├──────────────────────────────────┬──────────────────────────┤
│                                  │  JFK → DTW               │
│                                  │  Next departures (14:00) │
│            [US MAP]              │  ─────────────────────── │
│     ✈ animated flight arcs        │  DL 1234  15:10  $187   │
│     color-coded by price         │  AA 4502  16:25  $214    │
│                                  │  DL 2210  17:45  $199    │
│                                  │  ─────────────────────── │
│                                  │  Price band (7 day):     │
│                                  │  [sparkline]  $170–$290  │
└──────────────────────────────────┴──────────────────────────┘
```

Components:

- **Map**: MapLibre GL + great-circle lines via `@turf/turf`. One arc per
  monitored route, thickness = # flights today, color = current price vs
  7-day median (cold/warm). Click arc → right panel.
- **Time scrubber**: top bar, ranges over the last N days of `snapshot.taken_at`.
  Scrubbing changes what the map and right panel show (historical re-play).
- **"Next takeable flights" panel**: the 3–5 soonest flights from
  `next_departures` at the scrubbed hour, with price and price-vs-median
  indicator.
- **Hour-of-day strip** (bottom): heatmap of price by hour of day × day,
  per selected route. Makes the "which time of day is cheapest" question
  instantly answerable.

Tech choices:

- **MapLibre GL** over Leaflet — vector tiles, smooth arc animation, free
  tiles via MapTiler or protomaps. Leaflet is fine too; MapLibre is
  better-looking for a "realistic and appealing" map.
- Animated plane icons: CSS `transform` along SVG paths, throttled to 30fps.
- No Mapbox (license cost).

## 8. What to delete

- `common/App.jsx`, `common/price-history-chart.js`, `common/serve-demo.js`,
  `common/styles.css`, `common/price-history-demo.html` — dead parallel demo.
- `src/components/CustomXAxis.tsx`, `UniqueKeyXAxis.tsx`,
  `CombinedPriceChart.tsx` — collapse into one chart component.
- `src/components/RoutesDashboard.tsx` scatter — map replaces it.
- Mock-data fallback paths in `api.ts` and `flight-prices.js`. Real errors
  should surface, not be papered over.
- Chart.js dependency (keep Recharts; we only need one charting lib, and
  Recharts is already the primary).

## 9. Milestones

M1 — **Data pipeline** (1 week)
  - New schema + migration
  - `FlightProvider` interface with Amadeus impl
  - `scripts/snapshotRoutes.ts` + GH Actions hourly cron
  - Backfill 7 days of data before M2 demo

M2 — **Map UI** (1 week)
  - MapLibre page, monitored routes rendered as arcs
  - Right-panel "next departures" reading from `next_departures`
  - Time scrubber over last 7 days

M3 — **Polish + second provider** (0.5–1 week)
  - SerpAPI provider impl (gated on the cost decision in §3)
  - Hour-of-day heatmap
  - Kill `common/` and mock fallbacks
  - README rewrite, remove Apollo/Alpha demo clutter

M4 — **Stretch** (not committed)
  - Forecast: extrapolate price trajectory per flight using the snapshot
    history (simple exponential smoothing is enough — do not ship ML for this)
  - Booking/notification agent (already in backlog)

## 10. Decisions needed before M1 starts

1. SvelteKit rewrite, or stay on React? — **recommend: stay on React**
2. SerpAPI budget approved? — if no, drop "Google Flights" framing
3. Cron host: GH Actions (recommend) vs Netlify Scheduled Functions vs CDK/Lambda?
4. Postgres host: current local setup → Supabase (already in `/supabase`) or Neon?
5. Which monitored routes in v1? Confirm the §4 list.

Once these 5 are answered, M1 is unambiguous and implementable.
