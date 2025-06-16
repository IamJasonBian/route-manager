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

## 🚀 Features

- **Price Analysis** - Monitor flight prices with forecasting and volatility analysis
- **Route Management** - Track and analyze flight routes and pricing
- **API Integration** - Seamless integration with Amadeus Flight API
- **Real-time Data** - Get up-to-date flight information and pricing
- **CI/CD Pipeline** - Automated deployment with GitHub Actions
- **Serverless Functions** - Powered by Netlify Functions

## 🚀 Quick Start

### Local Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3001
   - Netlify Dev: http://localhost:3000

### Production Deployment with GitHub Actions

This project includes a GitHub Actions workflow for automatic deployment to Netlify. Follow these steps to set it up:

1. **Add Repository Secrets**
   - Go to your GitHub repository Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
     - `NETLIFY_SITE_ID`: Your Netlify site ID (found in Site settings > Site information)
     - `AMADEUS_API_KEY`: Your Amadeus API key
     - `AMADEUS_API_SECRET`: Your Amadeus API secret
     - `DB_*`: Your production database credentials

2. **Push to Main Branch**
   - The workflow will automatically trigger on push to the `main` branch
   - Monitor the deployment in the GitHub Actions tab

3. **Deploy Manually**
   - Go to the Actions tab in your repository
   - Select the "Deploy to Netlify" workflow
   - Click "Run workflow" and select the branch to deploy

### Environment Variables

For local development, create a `.env` file in the root directory with the following variables:

```env
# Netlify
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id

# Amadeus API
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
AMADEUS_HOSTNAME=test  # Use 'test' for development, 'production' for production

# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=your_db_host
DB_PORT=5432
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests

## 🛠️ Development

### Prerequisites
- Node.js 18+ & npm 9+
- Amadeus API credentials (for production use)
- PostgreSQL (for local development)

### 🛠️ Environment Setup

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

4. **Database setup**
   - Ensure PostgreSQL is running
   - Update the database connection details in `.env`

### 🏃‍♂️ Running Locally

#### Development Mode
```bash
# Start the development server
npm run dev:clean
```

This will start:
- Frontend on http://localhost:3000
- Netlify dev server on http://localhost:8888
- API endpoints under `/.netlify/functions/`

#### Production Build
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### 🌐 Available API Endpoints

- `GET /.netlify/functions/health` - Health check
- `POST /.netlify/functions/search-flights` - Search for flights
- `GET /.netlify/functions/popular-routes` - Get popular routes
- `GET /.netlify/functions/flight-prices` - Get flight prices

## 🔧 Configuration

### Environment Variables

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

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set up the following environment variables in the Netlify dashboard:
   - `AMADEUS_API_KEY`
   - `AMADEUS_API_SECRET`
   - Database connection variables

3. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```bash
# Clone the repository
git clone https://github.com/yourusername/route-manager.git
cd route-manager

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Running the Application

```bash
# Development server
npm run dev

# Production build
npm run build
npm run preview
```

## 📚 Documentation

For detailed documentation, please refer to our [Wiki](https://github.com/yourusername/route-manager/wiki).

## 🌐 Mock Deployments

* Single site demo: [Design 1](https://apollo-route-manager-0acz9.netlify.app/)
* Multi-Page flight manager demo: [Design 2](https://route-manager-demo.netlify.app/) 

## 🛠️ Testing locally with your apis

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

### Running the local postgres db

```bash
# Start the database
npm run db:up

# Stop the database
npm run db:down

#Example SQL

select count(*), 
  avg(price), destination from routes group by destination;

select count(*), 
  avg(price), origin from routes group by origin;
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made in 🏠 in NYC, ready to go to LGA, JFK, or EWK anytime
</div>
