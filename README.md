# Bitcoin Tracker

A real-time Bitcoin price tracking and cryptocurrency market analysis application built with React and TypeScript.

## Features

- Real-time Bitcoin price monitoring
- Interactive price history charts (24h, 7d, 30d, 90d, 1Y)
- Market statistics (market cap, volume, ATH, supply)
- Cryptocurrency comparison (Bitcoin, Ethereum, Solana, etc.)
- Auto-refresh every 60 seconds

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: CoinGecko (free, no API key required)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API

This app uses the [CoinGecko API](https://www.coingecko.com/en/api/documentation) which is:
- Free to use
- No API key required
- CORS-enabled for frontend calls

## License

MIT
