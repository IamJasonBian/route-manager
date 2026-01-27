// Robinhood Portfolio Netlify Function
// Fetches portfolio data from Robinhood API
// Uses Netlify Blobs for token persistence

const tokenStore = require('./lib/tokenStore.cjs');

const ROBINHOOD_API_BASE = 'https://api.robinhood.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

/**
 * Get authentication token from Blob store.
 */
async function getAuthToken() {
  const token = await tokenStore.getToken();
  if (!token) {
    throw new Error('Not authenticated. Connect to Robinhood first.');
  }
  return token;
}

async function fetchWithAuth(endpoint) {
  const token = await getAuthToken();

  const response = await fetch(`${ROBINHOOD_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, clear cache
      await tokenStore.clearToken();
      throw new Error('Session expired. Please reconnect to Robinhood.');
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

async function getPortfolio() {
  const [accounts, positions] = await Promise.all([
    fetchWithAuth('/accounts/'),
    fetchWithAuth('/positions/?nonzero=true'),
  ]);

  const account = accounts.results?.[0];
  if (!account) {
    throw new Error('No Robinhood account found');
  }

  // Get portfolio value
  const portfolioUrl = account.portfolio?.replace(ROBINHOOD_API_BASE, '') || '/portfolios/';
  const portfolio = await fetchWithAuth(portfolioUrl);

  // Process positions
  const positionsData = positions.results || [];

  // Fetch instrument details for each position
  const enrichedPositions = await Promise.all(
    positionsData.map(async (position) => {
      try {
        const instrumentUrl = position.instrument.replace(ROBINHOOD_API_BASE, '');
        const instrument = await fetchWithAuth(instrumentUrl);

        // Get current quote
        const quoteUrl = `/quotes/${instrument.symbol}/`;
        let quote = null;
        try {
          quote = await fetchWithAuth(quoteUrl);
        } catch (e) {
          console.warn(`Could not fetch quote for ${instrument.symbol}`);
        }

        const quantity = parseFloat(position.quantity);
        const averageCost = parseFloat(position.average_buy_price);
        const currentPrice = quote ? parseFloat(quote.last_trade_price) : averageCost;
        const totalCost = quantity * averageCost;
        const currentValue = quantity * currentPrice;
        const gain = currentValue - totalCost;
        const gainPercent = totalCost > 0 ? (gain / totalCost) * 100 : 0;

        return {
          symbol: instrument.symbol,
          name: instrument.simple_name || instrument.name,
          quantity: quantity,
          averageCost: averageCost,
          currentPrice: currentPrice,
          totalCost: totalCost,
          currentValue: currentValue,
          gain: gain,
          gainPercent: gainPercent,
        };
      } catch (e) {
        console.error('Error processing position:', e);
        return null;
      }
    })
  );

  return {
    accountNumber: account.account_number,
    buyingPower: parseFloat(account.buying_power || 0),
    cash: parseFloat(account.cash || 0),
    portfolioValue: parseFloat(portfolio.equity || 0),
    extendedHoursValue: parseFloat(portfolio.extended_hours_equity || portfolio.equity || 0),
    totalGain: parseFloat(portfolio.equity || 0) - parseFloat(portfolio.adjusted_equity_previous_close || portfolio.equity || 0),
    positions: enrichedPositions.filter(p => p !== null),
  };
}

async function getRecentOrders() {
  const orders = await fetchWithAuth('/orders/?updated_at[gte]=2024-01-01');

  const enrichedOrders = await Promise.all(
    (orders.results || []).slice(0, 50).map(async (order) => {
      try {
        const instrumentUrl = order.instrument.replace(ROBINHOOD_API_BASE, '');
        const instrument = await fetchWithAuth(instrumentUrl);

        return {
          id: order.id,
          symbol: instrument.symbol,
          name: instrument.simple_name || instrument.name,
          side: order.side,
          type: order.type,
          quantity: parseFloat(order.quantity),
          price: parseFloat(order.price || order.average_price || 0),
          state: order.state,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        };
      } catch (e) {
        return null;
      }
    })
  );

  return enrichedOrders.filter(o => o !== null);
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const action = event.queryStringParameters?.action || 'portfolio';

    let data;
    switch (action) {
      case 'status':
        data = await tokenStore.getAuthStatus();
        break;

      case 'portfolio':
        data = await getPortfolio();
        break;

      case 'orders':
        data = await getRecentOrders();
        break;

      default:
        throw new Error(`Unknown action: ${action}. Available: status, portfolio, orders`);
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Robinhood API error:', error);

    const isAuthError = error.message.includes('Not authenticated') || error.message.includes('expired');

    return {
      statusCode: isAuthError ? 401 : 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message || 'An error occurred',
        requiresAuth: isAuthError,
      }),
    };
  }
};
