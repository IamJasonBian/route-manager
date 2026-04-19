# Simple Trip Proposals

<div align="center">
  <p align="center">
    <a href="#">
      <img src="https://img.shields.io/badge/Status-Development-yellow" alt="Status">
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
    </a>
  </p>
</div>

## Environments

| Environment | URL |
|-------------|-----|
| Prod | https://route-manager-prod.netlify.app/ |

## Overview

Simple Trip Proposals reduces booking friction by wrapping around **Itinerary** and **Trip** objects and surfacing manual workflows. The goal is an extremely low-latency trip proposal app that makes it easy to search, propose, and act on travel plans.

### What It Does

- **Trip Proposals** -- Create, track, and manage trip proposals backed by real flight data. Proposals wrap an itinerary with context (rationale, price targets, status).
- **Low-Latency Flight Search** -- Fetch flight prices with historical and volatility analysis via Amadeus API, with Google Flights links for comparison.
- **Revenue Capture Automation (planned)** -- Automated workflows for cancellations, credits, and rebook opportunities when prices drop or schedules change.
- **Itinerary Management (planned)** -- Full itinerary objects with multi-leg trips, booking references, and change tracking.

### What's In Scope

- Flight search and price monitoring
- Trip proposal creation and lifecycle management (draft > proposed > accepted/rejected)
- Price trend analysis and historical data
- Google Flights integration for booking/comparison
- Automated rebook and credit capture workflows (planned)
- Agentic ticket and change management via Amadeus API (planned)

### What's Out of Scope

- Phone refunds and callbacks
- Finding the absolute best price on the market (we optimize for a specific user's context)
- Multi-provider booking aggregation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI |
| Charts | Recharts, Chart.js |
| Database | SQLite (local dev), TimescaleDB/Postgres (production) |
| ORM | Drizzle ORM with drizzle-kit migrations |
| Backend | Netlify Functions (serverless) |
| API | Amadeus Flight API, Google Flights (URL) |
| Deployment | Netlify, GitHub Actions |

## Quick Start

### Prerequisites
- Node.js 18+ & npm 9+
- Amadeus API credentials (for live flight data)
- Netlify Account (for hosting serverless functions)

### Setup

```bash
git clone https://github.com/yourusername/route-manager.git
cd route-manager
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Amadeus API keys

# Generate and apply database migrations (SQLite locally)
npx drizzle-kit generate
npx drizzle-kit push

# Start development server
npm run dev:clean
```

This starts:
- Frontend on http://localhost:3000
- Netlify dev server on http://localhost:8888
- API endpoints under `/.netlify/functions/`

### Production Build

```bash
npm run build
npm run preview
```

### Database

**Local development** uses SQLite (`local.db`) via better-sqlite3. No Docker required.

**Production** uses TimescaleDB/Postgres. For local Postgres testing:

```bash
docker compose up -d
```

Docker Compose provisions TimescaleDB with:
- User: `alpha`, Password: `alpha`, Database: `alpha`
- Port: `5432`

### Migrations

Migrations are managed by drizzle-kit. Schema is defined in `src/db/schema.ts`.

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/search-flights` | POST | Search flights via Amadeus |
| `/flight-prices` | GET | Get 30-day price history |
| `/airport-search` | GET | Airport/city autocomplete |
| `/routes` | GET/POST/DELETE | Route CRUD |
| `/proposals` | GET/POST/PUT/DELETE | Trip proposal CRUD |
| `/get-routes-summary` | GET | Routes with price history |

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `AMADEUS_API_KEY` | Amadeus API key | - |
| `AMADEUS_API_SECRET` | Amadeus API secret | - |
| `AMADEUS_HOSTNAME` | Amadeus API hostname | `production` |
| `DB_PATH` | SQLite database path (local) | `./local.db` |

## Deployment

Deployments via GitHub Actions:

- **Gamma**: Auto-deploys on push/PR to main
- **Prod**: Manual deployment only

**Required GitHub Secrets:** `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID_GAMMA`, `NETLIFY_SITE_ID_PROD`

Netlify Account: jasonzb@umich.edu

## Testing

```bash
npm test
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create a new Pull Request
3. Contact jason.bian64@gmail.com for questions

## License

MIT License - see [LICENSE](LICENSE).
