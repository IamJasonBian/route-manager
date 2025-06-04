# ✈️ Apollo Flight Trader

<div align="center">
  <p align="center">
    <a href="#">
      <img src="https://img.shields.io/badge/Status-Active-success" alt="Status">
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
    </a>
    <a href="https://github.com/yourusername/route-manager/actions">
      <img src="https://github.com/yourusername/route-manager/actions/workflows/main.yml/badge.svg" alt="Build Status">
    </a>
  </p>
</div>



## Features

- **Price Analysis** - Monitor flight prices with 4-month forecasting and price + volatitity curves. Understand the efficient frontier of transfers and 1 stop + nonstop routes across multiples nodes into one outbound node. Analyze all good destinations from a single flight node.
- **Same-day books** - Find flights where prices don't significantly change over time (shuttle routes) and opportunistic day of drops and bookings
- **Push Alerts** - Get notified about price drops and good day of bookings

## Quick Start

### Prerequisites
- Node.js 16+ & npm 8+
- Amadeus API credentials (for production use)

### Installation and Forking Localhost for deployment/forwarded ports

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

Single site demo: [Design 1](https://apollo-route-manager-0acz9.netlify.app/)
Mult-page flight manager demo: [Design 2](https://route-manager-demo.netlify.app/) 

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
