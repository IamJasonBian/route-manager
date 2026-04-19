# Claude Code Instructions

## Git Commits

When creating git commits:
- Do NOT include the "Generated with Claude Code" tag
- Do NOT include the robot emoji or Claude Code link
- Do NOT include the Co-Authored-By line for Claude
- Keep commit messages clean and professional

---

## Overview

Simple Trip Proposals reduces booking friction by wrapping around Itinerary and Trip objects, surfacing manual workflows, and automating revenue capture for cancellations, credits, and rebooks. The goal is an extremely low-latency trip proposal app.

### Core Concepts
- **Trip Proposals** -- The central object. Wraps an itinerary with rationale, price targets, and lifecycle status (draft > proposed > accepted/rejected).
- **Itineraries** -- Flight route + dates + pricing. Sourced from Amadeus API and Google Flights.
- **Revenue Capture (planned)** -- Automated rebook/credit workflows when prices drop or schedules change.

### What's Out of Scope
- Phone refunds and callbacks
- Multi-provider booking aggregation

### Key Features
- Low-latency flight price monitoring with historical and volatility analysis
- Trip proposal creation, tracking, and lifecycle management
- Route management for tracking common flight routes and pricing
- Direct integration with Amadeus Flight API + Google Flights URL connector
- Planned: Automated rebook, cancellation credit capture, and buying agent

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI |
| Charts | Recharts, Chart.js |
| Database | SQLite (local), TimescaleDB/Postgres (prod) |
| ORM | Drizzle ORM, drizzle-kit migrations |
| Backend | Netlify Functions (serverless) |
| API | Amadeus Flight API, Google Flights (URL) |
| Deployment | Netlify, GitHub Actions |

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (frontend + Netlify functions)
npm run dev:clean

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
npm run test:watch

# Linting
npm run lint

# Deploy to Netlify
npm run deploy

```

## Workspace Structure

**IMPORTANT**: Only look inside the directories defined below. Do not explore or modify files outside this structure.

```
nairobi/
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI primitives (Radix-based)
│   │   ├── ProposeTripModal.tsx  # Trip proposal creation dialog
│   │   ├── ProposalCard.tsx      # Proposal display card
│   │   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   │   ├── RouteCard.tsx
│   │   ├── PriceChart.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx          # Proposals-first landing page
│   │   ├── ProposalsPage.tsx     # Trip proposals management
│   │   ├── SearchFlightsPage.tsx
│   │   └── PriceTrendsPage.tsx
│   ├── db/               # Drizzle ORM database layer
│   │   ├── schema.ts     # Table definitions (routes, priceHistory, proposals)
│   │   └── client.ts     # SQLite/Postgres connection factory
│   ├── services/         # API service layers
│   │   ├── proposalService.ts  # Trip proposal CRUD
│   │   ├── routeService.ts     # Route CRUD (calls Netlify functions)
│   │   └── api.ts              # Flight price API client
│   ├── hooks/            # React hooks
│   │   └── useTheme.ts   # Dark/light mode hook
│   ├── types/            # TypeScript type definitions
│   │   ├── proposal.ts   # TripProposal types
│   │   └── flight.ts
│   ├── utils/            # Utility functions
│   │   └── googleFlights.ts  # Google Flights URL builder
│   ├── config/           # Configuration files
│   └── lib/              # Shared libraries
├── netlify/
│   └── functions/        # Serverless API endpoints
│       ├── routes.js     # Route CRUD (Drizzle)
│       ├── proposals.js  # Proposal CRUD (Drizzle)
│       ├── search-flights.js
│       ├── flight-prices.js
│       ├── health.js
│       └── ...
├── drizzle/              # Generated migration files
├── drizzle.config.ts     # Drizzle-kit configuration
└── docker-compose.yml    # TimescaleDB for production-like testing
```

## Architecture Patterns

### Frontend
- **Component Structure**: Functional components with hooks
- **State Management**: React useState/useEffect (no Redux)

### Backend (Netlify Functions)
- **Pattern**: Serverless functions with CORS middleware
- **Database**: Drizzle ORM with SQLite (local dev) / TimescaleDB-Postgres (production)
- **API Integration**: Amadeus SDK for flight data, Google Flights URL generation
- **Migrations**: drizzle-kit (schema in `src/db/schema.ts`, output in `drizzle/`)

### Deployment
- **Environments**: Alpha (development), Gamma (staging), and Prod (protected)
- **CI/CD**: GitHub Actions with config-driven environment selection
- **Configuration**: Edit `deployment-config.json` to change target environment
- **CDK**: Optional AWS CDK infrastructure in `/cdk` directory
- **Secrets**: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID_GAMMA`, `NETLIFY_SITE_ID_PROD`
- **Alpha Site ID**: `b26b3133-30c1-46f3-b976-59ab7c928b57` (hardcoded)

## Authentication

Currently no user authentication implemented. Amadeus API credentials are stored as environment variables in Netlify:
- `AMADEUS_API_KEY`
- `AMADEUS_API_SECRET`
- `AMADEUS_HOSTNAME`

## Backlog

Project backlog: https://github.com/users/IamJasonBian/projects/1

## Environments

| Environment | URL | Site ID |
|-------------|-----|---------|
| Alpha | https://route-manager-alpha.netlify.app/ | b26b3133-30c1-46f3-b976-59ab7c928b57 |
| Gamma | https://route-manager-gamma.netlify.app/ | (GitHub secret) |
| Prod | https://route-manager-prod.netlify.app/ | (GitHub secret) |

## Changing Deployment Target

To deploy to a different environment:
1. Edit `deployment-config.json` in the root directory
2. Change `targetEnvironment` to `"alpha"`, `"gamma"`, or `"prod"`
3. Submit a PR with the change
4. Once merged, the workflow will deploy to the specified environment

Alternatively, use the manual workflow dispatch in GitHub Actions to deploy to any environment on-demand.
