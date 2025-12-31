# Market Tracker

A real-time Bitcoin and S&P 500 price tracking application with volatility analysis and push notifications.

## Features

- **Real-time Price Monitoring**: Bitcoin and S&P 500 price tracking
- **Volatility Analysis**: 30-day annualized volatility calculation and comparison
- **Price Alerts**: Push notifications when prices cross your target thresholds
- **Interactive Charts**: Price history with 24h, 7d, 30d, 90d, and 1Y ranges
- **Auto-refresh**: Data updates every 60 seconds

## Metrics Tracked

Both Bitcoin and S&P 500 share the same metrics:
- Current price with 24h change
- 24h high/low
- 7-day and 30-day price change percentage
- 24h trading volume
- 30-day annualized volatility

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## APIs

| Asset | API | Key Required |
|-------|-----|--------------|
| Bitcoin | [CoinGecko](https://www.coingecko.com/en/api/documentation) | No |
| S&P 500 | [Alpha Vantage](https://www.alphavantage.co/support/#api-key) | Yes (free) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## S&P 500 Setup

To enable S&P 500 tracking:
1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Click "Add API Key" in the app
3. Enter your API key (stored locally in your browser)

## Push Notifications

Click the bell icon to set up price alerts:
1. Enable browser notifications when prompted
2. Set target prices for Bitcoin or S&P 500
3. Receive alerts when prices cross your thresholds

## License

MIT
