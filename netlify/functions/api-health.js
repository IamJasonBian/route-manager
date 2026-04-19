// Deep API health probe.
//
// Verifies the Amadeus path actually returns flight data — not just that the
// process is up. Returns HTTP 503 (not 500) on probe failure so monitors
// distinguish "API is broken" from "function crashed".
//
// Query params:
//   ?deep=1     also probe every monitored route (uses more API quota)
//   ?route=A-B  probe a single route in addition to the canonical one
//
// Response:
//   { status: 'pass'|'warn'|'fail', checks: [...], elapsed_ms, ranAt }

import Amadeus from 'amadeus';

const CANONICAL_ROUTE = { origin: 'JFK', destination: 'DTW' };

const MONITORED_ROUTES = [
  { origin: 'JFK', destination: 'DTW' },
  { origin: 'LGA', destination: 'DTW' },
  { origin: 'EWR', destination: 'DTW' },
  { origin: 'JFK', destination: 'ORD' },
  { origin: 'JFK', destination: 'BOS' },
  { origin: 'JFK', destination: 'SFO' },
];

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function pass(id, extra = {}) { return { id, status: 'pass', ...extra }; }
function warn(id, extra = {}) { return { id, status: 'warn', ...extra }; }
function fail(id, extra = {}) { return { id, status: 'fail', ...extra }; }

async function timed(fn) {
  const t0 = Date.now();
  try {
    const value = await fn();
    return { value, ms: Date.now() - t0, error: null };
  } catch (error) {
    return { value: null, ms: Date.now() - t0, error };
  }
}

async function probeRoute(amadeus, origin, destination, departureDate) {
  const result = await timed(() => amadeus.shopping.flightOffersSearch.get({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults: 1,
    nonStop: true,
    max: 1,
    currencyCode: 'USD',
  }));

  if (result.error) {
    return fail(`query.${origin}-${destination}`, {
      ms: result.ms,
      message: result.error.description || result.error.message || 'unknown error',
      statusCode: result.error.response?.statusCode,
    });
  }
  const offers = result.value?.data || [];
  if (offers.length === 0) {
    return fail(`query.${origin}-${destination}`, {
      ms: result.ms,
      message: 'provider returned 0 offers',
      departureDate,
    });
  }
  const samplePrice = parseFloat(offers[0].price?.total);
  if (!samplePrice || Number.isNaN(samplePrice)) {
    return fail(`query.${origin}-${destination}`, {
      ms: result.ms,
      message: 'first offer missing price.total',
    });
  }
  return pass(`query.${origin}-${destination}`, {
    ms: result.ms,
    offers: offers.length,
    samplePrice,
    departureDate,
  });
}

export const handler = async (event) => {
  const t0 = Date.now();
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  const params = event.queryStringParameters || {};
  const deep = params.deep === '1' || params.deep === 'true';
  const checks = [];

  // 1. Env vars present.
  const hasKey = !!process.env.AMADEUS_API_KEY;
  const hasSecret = !!process.env.AMADEUS_API_SECRET;
  checks.push(
    hasKey && hasSecret
      ? pass('env', { hostname: process.env.AMADEUS_HOSTNAME || 'production' })
      : fail('env', {
          message: 'AMADEUS_API_KEY and/or AMADEUS_API_SECRET missing',
          hasKey, hasSecret,
        })
  );

  // 2. Amadeus client constructible (does not auth until first request).
  let amadeus;
  if (hasKey && hasSecret) {
    try {
      amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET,
        hostname: process.env.AMADEUS_HOSTNAME || 'production',
      });
      checks.push(pass('client'));
    } catch (e) {
      checks.push(fail('client', { message: e.message }));
    }
  }

  // 3. Canonical query: JFK->DTW, tomorrow, nonstop. Must return data.
  if (amadeus) {
    const departureDate = tomorrowISO();
    checks.push(await probeRoute(
      amadeus, CANONICAL_ROUTE.origin, CANONICAL_ROUTE.destination, departureDate
    ));

    // 4. Optional single ad-hoc route from ?route=A-B
    if (params.route) {
      const m = String(params.route).toUpperCase().match(/^([A-Z]{3})-([A-Z]{3})$/);
      if (m) {
        checks.push(await probeRoute(amadeus, m[1], m[2], departureDate));
      } else {
        checks.push(warn(`query.${params.route}`, { message: 'invalid ?route= format, expected AAA-BBB' }));
      }
    }

    // 5. Deep probe — every monitored route.
    if (deep) {
      const others = MONITORED_ROUTES.filter(
        r => !(r.origin === CANONICAL_ROUTE.origin && r.destination === CANONICAL_ROUTE.destination)
      );
      const results = await Promise.all(
        others.map(r => probeRoute(amadeus, r.origin, r.destination, departureDate))
      );
      checks.push(...results);
    }
  }

  const failed = checks.filter(c => c.status === 'fail').length;
  const warned = checks.filter(c => c.status === 'warn').length;
  const status = failed > 0 ? 'fail' : warned > 0 ? 'warn' : 'pass';

  return {
    statusCode: status === 'fail' ? 503 : 200,
    headers,
    body: JSON.stringify({
      status,
      checks,
      summary: { total: checks.length, passed: checks.length - failed - warned, warned, failed },
      ranAt: new Date().toISOString(),
      elapsed_ms: Date.now() - t0,
      deep,
    }, null, 2),
  };
};
