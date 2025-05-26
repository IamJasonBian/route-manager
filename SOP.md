# ✈️ Apollo Route Manager

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site-name/overview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A flight route management system that tracks and visualizes flight prices over time, helping you find the best deals for your trips.

## 📋 Table of Contents
- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🌐 Demo](#-demo)
- [🔧 API Usage](#-api-usage)
- [🔮 Future Features](#-future-features)

## 🚀 Quick Start

Get started with the application in just a few simple steps:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. For production build
npm run build

# 4. Preview production build
npm run preview
```

## ✨ Features

- 📊 **Price Visualization**: 4-month price curve for outbound NYC flights
- 🔄 **Real-time Data**: Fetches from Amadeus API with mock data fallback
- 📱 **Interactive Charts**: Built with Recharts for smooth user experience
- 🔍 **Verification**: Direct Google Flights links for price verification
- ⚡ **Serverless Backend**: Powered by Netlify Functions

## 🌐 Demo

Check out the live demo with mock data:

🔗 [View Demo](https://6829819a09a0de55357b98eb--apollo-route-manager-0acz9.netlify.app/)

## 🔧 API Usage

### Prerequisites
- Amadeus API credentials (key and secret)
- `.env` file with your credentials

### Authentication

1. **Get Access Token**:

```bash
# Check connectivity and get access token
source .env && curl -X POST "https://api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$AMADEUS_API_KEY&client_secret=$AMADEUS_API_SECRET" | jq
```

2. **Make API Requests**:

```bash
# Get flight offers example
source .env && \
TOKEN=$(curl -s -X POST "https://api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$AMADEUS_API_KEY&client_secret=$AMADEUS_API_SECRET" | \
  jq -r '.access_token') && \
curl -s "https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=NYC&destinationLocationCode=LAX&departureDate=$(date -v+3m +%Y-%m-%d)&adults=1&nonStop=true&max=1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

> **Note**: For detailed API documentation, visit [Amadeus Developer Portal](https://developers.amadeus.com/my-apps/route-price-manager)

## 🔮 Future Features

- 🎯 One-click cancel button for existing booked routes
- ⏩ One-click flight rescheduling for future dates
- 📱 Mobile app integration
- 🔔 Price drop alerts
- 🗓️ Advanced date flexibility search
