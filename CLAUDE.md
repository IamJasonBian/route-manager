# Claude Code Instructions

## Git Commits

When creating git commits:
- Do NOT include the "Generated with Claude Code" tag
- Do NOT include the robot emoji or Claude Code link
- Do NOT include the Co-Authored-By line for Claude
- Keep commit messages clean and professional

---

## Overview

Apollo Flight Trader (Route Manager) is a flight price monitoring and booking optimization tool. It enables last-minute travel by prebooking commonly taken flights at flex/main levels, allowing for spontaneous trips and upgrades while reducing airport planning overhead.

### Key Features
- Low latency flight price monitoring with historical and volatility analysis
- Route management for tracking common flight routes and pricing
- Direct integration with Amadeus Flight API
- Planned: Booking, rescheduling, and buying agent

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI |
| Charts | Recharts, Chart.js |
| Backend | Netlify Functions (serverless) |
| API | Amadeus Flight API |
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

```
monterrey/
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI primitives (Radix-based)
│   │   ├── FlightSearch.tsx
│   │   ├── RoutesDashboard.tsx
│   │   ├── PriceChart.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   ├── services/         # API service layers
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── lib/              # Shared libraries
├── netlify/
│   └── functions/        # Serverless API endpoints
│       ├── search-flights.js
│       ├── flight-prices.js
│       ├── popular-routes.js
│       ├── health.js
│       └── ...
├── common/               # Shared code between frontend and functions
└── data/                 # Static data files
```

## Architecture Patterns

### Frontend
- **Component Structure**: Functional components with hooks
- **State Management**: React useState/useEffect (no Redux)

### Backend (Netlify Functions)
- **Pattern**: Serverless functions with CORS middleware
- **API Integration**: Amadeus SDK for flight data

### Deployment
- **Environments**: Gamma (staging) and Prod (protected)
- **CI/CD**: GitHub Actions with manual prod deployment gate
- **Secrets**: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID_GAMMA`, `NETLIFY_SITE_ID_PROD`

## Authentication

Currently no user authentication implemented. Amadeus API credentials are stored as environment variables in Netlify:
- `AMADEUS_API_KEY`
- `AMADEUS_API_SECRET`
- `AMADEUS_HOSTNAME`

## Backlog

Project backlog: https://github.com/users/IamJasonBian/projects/1

## Environments

| Environment | URL |
|-------------|-----|
| Gamma | https://route-manager-gamma.netlify.app/ |
| Prod | https://route-manager-prod.netlify.app/ |
