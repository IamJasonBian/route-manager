# ✈️ Apollo Flight Trader

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
| Gamma | https://route-manager-gamma.netlify.app/ |
| Prod | https://route-manager-prod.netlify.app/ |

# Overview 

##  Features

Route Manager is designed to enable last minute travel by prebooking commonly taken flights at flex/main levels. This allows for spontaneous trips and upgrades and reduces overall airport planning. Additionally, by solving for price and modeling travel risks and dependencies, Route Manager can increase travel optionality.

- **Low Latency Flight Monitoring** - Fetch flight prices with historical, projected, volatility and delay (planned) analysis
- **Route Management** - Track common flight routes and associated pricing
- **API Integration** - Direct Integration with Amadeus Flight API 
- **Booking, Rescheduling, and Buying Agent (planned)**
  * Track and Book commonly flown routes at historical lows with reasonable refund, exchange, and rescheduling fees in anticipation of future upgrades as we approach the travel date
      * Notification based - Change Management via the original airline site or travel brokers (I.E. VentureX) - user inputs the flight into the system
      * Agentic - Policy driven Ticket and Change Management via the Amadeus Flight API 

Route Manager is good at
* Finding the best price in context of a specific user
* Reducing and simplifying the technical dependencies surrounding air travel by improving ease of access

Route Manager not good at
* Finding the best price overall on the market

##  Tenants

# Quick Start

### Prerequisites
- Node.js 18+ & npm 9+
- Amadeus API credentials (for live data and production use)
- Netlify Account (for hosting data access functions, we're using netlify rather than doing direct calls from front-end code)
- Github Repository and Pipelines (for managing personal stacks across local and remote environments)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/route-manager.git
   cd route-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration
   ```bash
   cp .env.example .env
   ```

4. **Netlify and Amadeus setup**
   - Set up an Amadeus account to provision prod keys
   - Set up Netlify environments (Amadeus variables are loaded into the Netlify environment and accessed at runtime)

### Running Locally

#### Development Build

```bash
# Start the development server
npm run dev:clean
```

This will start:
- Frontend on http://localhost:3000
- Netlify dev server on http://localhost:8888
- API endpoints under `/.netlify/functions/`

```
# Start the netlify functions (add instructions)
```

#### Production Build

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

#### Deployment

Deployments are managed via GitHub Actions:

- **Gamma**: Automatically deploys on push/PR to main
- **Prod**: Manual deployment only (blocked by default)

To deploy to prod:
1. Go to Actions → "Deploy to Netlify"
2. Click "Run workflow"
3. Check "Deploy to PROD (requires manual approval)"
4. Click "Run workflow"

**Required GitHub Secrets:**

Netlify Account Used: jasonzb@umich.edu

| Secret | Description |
|--------|-------------|
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token |
| `NETLIFY_SITE_ID_GAMMA` | Site ID for gamma environment |
| `NETLIFY_SITE_ID_PROD` | Site ID for prod environment |

### Available Netlify API Endpoints in Gamma and Prod

- `GET /.netlify/functions/health` - Health check
- `POST /.netlify/functions/search-flights` - Search for flights
- `GET /.netlify/functions/popular-routes` - Get popular routes
- `GET /.netlify/functions/flight-prices` - Get flight prices

##  Configuration

### Development Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Port to run the server | `3000` |
| `AMADEUS_API_KEY` | Amadeus API key | - |
| `AMADEUS_API_SECRET` | Amadeus API secret | - |
| `AMADEUS_HOSTNAME` | Amadeus API hostname | `production` |
| `DB_USER` | Database username | `routeuser` |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | `routedb` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Other Deployments

* Alpha | Single Page Analytics Demo: https://apollo-route-manager-0acz9.netlify.app/



# Scratch

## E2E Docker Build (depreciated)

```
npm install
npm run build
docker compose up -d
npm run dev -- --port 5177
npx netlify dev --targetPort 5177 --port 3005
```
 

## Calling the Api Locally

### Authentication

```bash
# Obtain access token
curl -X POST "https://api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_API_KEY&client_secret=YOUR_SECRET"
```

### Example Request

```bash
# Fetch flight offers
curl -X GET "https://api.amadeus.com/v2/shopping/flight-offers" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -G \
  --data-urlencode "originLocationCode=NYC" \
  --data-urlencode "destinationLocationCode=LAX" \
  --data-urlencode "departureDate=2023-12-15" \
  --data-urlencode "adults=1"
```

##  Contributing

1. Fork the repository
2. Create a new Pull Request
3. Feel free to contact me at jason.bian64@gmail.com for any requests or questions!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
