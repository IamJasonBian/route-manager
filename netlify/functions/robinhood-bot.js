// Robinhood Trading Bot Netlify Function
// Handles bot actions and trading decisions

const ROBINHOOD_API_BASE = 'https://api.robinhood.com';

let authToken = null;
let tokenExpiry = null;

// In-memory bot action log (resets on cold start)
// In production, you'd want to persist this to a database
let botActions = [];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function authenticate() {
  const username = process.env.RH_USER;
  const password = process.env.RH_PASS;

  if (!username || !password) {
    throw new Error('RH_USER and RH_PASS environment variables are required');
  }

  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return authToken;
  }

  const response = await fetch(`${ROBINHOOD_API_BASE}/oauth2/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      scope: 'internal',
      client_id: 'c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS',
      username: username,
      password: password,
      device_token: generateDeviceToken(),
    }),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const data = await response.json();

  if (data.mfa_required) {
    throw new Error('MFA required');
  }

  authToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return authToken;
}

function generateDeviceToken() {
  const username = process.env.RH_USER || '';
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${Math.abs(hash).toString(16).padStart(8, '0')}-0000-0000-0000-000000000000`;
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = await authenticate();

  const response = await fetch(`${ROBINHOOD_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      authToken = null;
      tokenExpiry = null;
    }
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}

function logBotAction(action) {
  const logEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...action,
  };
  botActions.unshift(logEntry);
  // Keep only last 100 actions
  if (botActions.length > 100) {
    botActions = botActions.slice(0, 100);
  }
  return logEntry;
}

async function getQuote(symbol) {
  try {
    const quote = await fetchWithAuth(`/quotes/${symbol}/`);
    return {
      symbol: symbol,
      price: parseFloat(quote.last_trade_price),
      bidPrice: parseFloat(quote.bid_price),
      askPrice: parseFloat(quote.ask_price),
      previousClose: parseFloat(quote.previous_close),
    };
  } catch (e) {
    throw new Error(`Failed to get quote for ${symbol}: ${e.message}`);
  }
}

async function getInstrumentBySymbol(symbol) {
  const instruments = await fetchWithAuth(`/instruments/?symbol=${symbol}`);
  if (!instruments.results || instruments.results.length === 0) {
    throw new Error(`Instrument not found: ${symbol}`);
  }
  return instruments.results[0];
}

async function getAccount() {
  const accounts = await fetchWithAuth('/accounts/');
  if (!accounts.results || accounts.results.length === 0) {
    throw new Error('No account found');
  }
  return accounts.results[0];
}

// Bot analysis function - analyzes portfolio and suggests actions
async function analyzePortfolio() {
  const account = await getAccount();
  const positions = await fetchWithAuth('/positions/?nonzero=true');
  const buyingPower = parseFloat(account.buying_power || 0);

  const analysis = {
    timestamp: new Date().toISOString(),
    buyingPower: buyingPower,
    suggestions: [],
    holdings: [],
  };

  for (const position of positions.results || []) {
    try {
      const instrumentUrl = position.instrument.replace(ROBINHOOD_API_BASE, '');
      const instrument = await fetchWithAuth(instrumentUrl);
      const quote = await getQuote(instrument.symbol);

      const quantity = parseFloat(position.quantity);
      const averageCost = parseFloat(position.average_buy_price);
      const currentPrice = quote.price;
      const gainPercent = ((currentPrice - averageCost) / averageCost) * 100;

      const holding = {
        symbol: instrument.symbol,
        quantity,
        averageCost,
        currentPrice,
        gainPercent,
        value: quantity * currentPrice,
      };
      analysis.holdings.push(holding);

      // Simple bot logic for suggestions
      if (gainPercent > 20) {
        analysis.suggestions.push({
          type: 'TAKE_PROFIT',
          symbol: instrument.symbol,
          reason: `Up ${gainPercent.toFixed(1)}% - Consider taking profits`,
          priority: 'medium',
        });
      } else if (gainPercent < -15) {
        analysis.suggestions.push({
          type: 'STOP_LOSS',
          symbol: instrument.symbol,
          reason: `Down ${Math.abs(gainPercent).toFixed(1)}% - Consider stop loss`,
          priority: 'high',
        });
      }
    } catch (e) {
      console.error('Error analyzing position:', e);
    }
  }

  // Log the analysis
  logBotAction({
    type: 'ANALYSIS',
    status: 'completed',
    details: `Analyzed ${analysis.holdings.length} positions`,
    suggestions: analysis.suggestions.length,
  });

  return analysis;
}

// Place a market order (simulated in demo mode, real in live mode)
async function placeOrder(symbol, side, quantity, dryRun = true) {
  const instrument = await getInstrumentBySymbol(symbol);
  const quote = await getQuote(symbol);
  const account = await getAccount();

  const orderInfo = {
    symbol,
    side,
    quantity,
    price: quote.price,
    estimatedTotal: quantity * quote.price,
  };

  if (dryRun) {
    // Dry run - just log the action
    const action = logBotAction({
      type: side === 'buy' ? 'BUY_ORDER' : 'SELL_ORDER',
      status: 'simulated',
      symbol,
      quantity,
      price: quote.price,
      total: quantity * quote.price,
      dryRun: true,
    });

    return {
      status: 'simulated',
      message: `Dry run: Would ${side} ${quantity} shares of ${symbol} at $${quote.price.toFixed(2)}`,
      order: orderInfo,
      action,
    };
  }

  // Real order (use with caution!)
  const orderPayload = {
    account: account.url,
    instrument: instrument.url,
    symbol: symbol,
    type: 'market',
    time_in_force: 'gfd', // Good for day
    trigger: 'immediate',
    quantity: quantity.toString(),
    side: side,
  };

  try {
    const order = await fetchWithAuth('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });

    const action = logBotAction({
      type: side === 'buy' ? 'BUY_ORDER' : 'SELL_ORDER',
      status: 'submitted',
      orderId: order.id,
      symbol,
      quantity,
      price: quote.price,
      total: quantity * quote.price,
      dryRun: false,
    });

    return {
      status: 'submitted',
      orderId: order.id,
      order: orderInfo,
      action,
    };
  } catch (e) {
    const action = logBotAction({
      type: side === 'buy' ? 'BUY_ORDER' : 'SELL_ORDER',
      status: 'failed',
      symbol,
      quantity,
      error: e.message,
      dryRun: false,
    });

    throw new Error(`Order failed: ${e.message}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const action = event.queryStringParameters?.action || 'status';
    let body = {};

    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        // Ignore parse errors
      }
    }

    let data;
    switch (action) {
      case 'status':
        data = {
          status: 'running',
          actionsCount: botActions.length,
          lastAction: botActions[0] || null,
        };
        break;

      case 'actions':
        const limit = parseInt(event.queryStringParameters?.limit || '50');
        data = {
          actions: botActions.slice(0, limit),
          total: botActions.length,
        };
        break;

      case 'analyze':
        data = await analyzePortfolio();
        break;

      case 'quote':
        const symbol = event.queryStringParameters?.symbol;
        if (!symbol) {
          throw new Error('Symbol parameter required');
        }
        data = await getQuote(symbol.toUpperCase());
        break;

      case 'order':
        // POST only
        if (event.httpMethod !== 'POST') {
          throw new Error('POST method required for orders');
        }
        const { symbol: orderSymbol, side, quantity, dryRun = true } = body;
        if (!orderSymbol || !side || !quantity) {
          throw new Error('symbol, side, and quantity are required');
        }
        data = await placeOrder(
          orderSymbol.toUpperCase(),
          side.toLowerCase(),
          parseFloat(quantity),
          dryRun !== false
        );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
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
    console.error('Bot error:', error);

    logBotAction({
      type: 'ERROR',
      status: 'error',
      message: error.message,
    });

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message || 'An error occurred',
      }),
    };
  }
};
