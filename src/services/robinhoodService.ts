// Robinhood API Service
// Connects to allocation-engine-2.0 API for trading data

const ENGINE_API = 'https://allocation-engine-api.onrender.com/api';
const API_BASE = '/.netlify/functions';

// Auth types
export interface AuthStatus {
  authenticated: boolean;
  message: string;
  expiresAt?: string;
  expiresIn?: number;
  hasRefreshToken?: boolean;
  updatedAt?: string;
  error?: string;
  pendingVerification?: {
    type: 'mfa' | 'device';
    elapsedSeconds: number;
  };
}

export interface AuthResult {
  authenticated: boolean;
  message: string;
  requiresVerification?: boolean;
  requiresMFA?: boolean;
  verificationType?: 'device' | 'mfa';
  challengeType?: string;
  error?: string;
}

export interface Position {
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  gain: number;
  gainPercent: number;
}

export interface Portfolio {
  accountNumber: string;
  buyingPower: number;
  cash: number;
  portfolioValue: number;
  extendedHoursValue: number;
  totalGain: number;
  positions: Position[];
}

export interface Order {
  id: string;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  type: string;
  quantity: number;
  price: number;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface SymbolPnL {
  symbol: string;
  name: string;
  realizedPnL: number;
  totalBought: number;
  totalSold: number;
  buyCount: number;
  sellCount: number;
  avgBuyPrice: number;
  avgSellPrice: number;
  remainingShares: number;
  remainingCostBasis: number;
}

export interface FilledOrder {
  id: string;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
}

export interface OrderPnL {
  totalRealizedPnL: number;
  totalBuyVolume: number;
  totalSellVolume: number;
  symbols: SymbolPnL[];
  orders: FilledOrder[];
}

export interface OptionPosition {
  chain_symbol: string;
  option_type: string;
  strike: number;
  expiration: string;
  dte: number;
  quantity: number;
  position_type: string;
  avg_price: number;
  mark_price: number;
  multiplier: number;
  cost_basis: number;
  current_value: number;
  unrealized_pl: number;
  unrealized_pl_pct: number;
  underlying_price: number;
  break_even: number;
  greeks: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    iv: number;
  };
  expected_pl: {
    '-5%': number;
    '-1%': number;
    '+1%': number;
    '+5%': number;
    theta_daily: number;
  };
  chance_of_profit: number;
  recommended_action: {
    action: string;
    reasons: string[];
  };
  btc_correlation: number;
}

export interface SnapshotPosition {
  symbol: string;
  name?: string;
  type?: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  equity: number;
  profit_loss: number;
  profit_loss_pct: number;
  percent_change?: number | null;
  equity_change?: number | null;
  pe_ratio?: number | null;
  percentage?: number | null;
}

export interface SnapshotOrder {
  order_id: string;
  symbol: string;
  side: string;
  order_type: string;
  trigger: string;
  state: string;
  quantity: number;
  limit_price: number;
  stop_price: number | null;
  average_price?: number;
  filled_quantity?: number;
  created_at: string;
  updated_at: string;
}

export interface SymbolMarketData {
  metrics: {
    intraday_volatility: number;
    intraday_high: number;
    intraday_low: number;
    current_price: number;
    '30d_high': number;
    '30d_low': number;
  };
  orders: {
    active_buy: unknown;
    active_sell: unknown;
    order_history: unknown[];
  };
  last_signal: {
    signal: string;
    timestamp: string;
  };
  last_updated: string;
}

export interface MarketData {
  timestamp: string;
  symbols: Record<string, SymbolMarketData>;
}

export interface SnapshotOptionOrderLeg {
  side: string;
  position_effect: string;
  quantity: number;
  strike: number;
  expiration: string;
  option_type: string;
  chain_symbol: string;
}

export interface SnapshotOptionOrder {
  order_id: string;
  state: string;
  quantity: number;
  price: number;
  premium: number;
  processed_premium: number;
  direction: string;
  order_type: string;
  trigger: string;
  time_in_force: string;
  opening_strategy: string;
  created_at: string;
  updated_at: string;
  legs: SnapshotOptionOrderLeg[];
}

export interface OrderBookSnapshot {
  timestamp: string;
  order_book: SnapshotOrder[];
  portfolio: {
    cash: {
      cash: number;
      cash_available_for_withdrawal: number;
      buying_power: number;
      tradeable_cash: number;
    };
    equity: number;
    market_value: number;
    positions: SnapshotPosition[];
    open_orders: SnapshotOrder[];
    open_option_orders?: SnapshotOptionOrder[];
    options?: OptionPosition[];
  };
  recent_orders?: SnapshotOrder[];
  recent_option_orders?: SnapshotOptionOrder[];
  market_data: MarketData | null;
}

export interface BotAction {
  id: string;
  timestamp: string;
  type: string;
  status: string;
  symbol?: string;
  quantity?: number;
  price?: number;
  total?: number;
  message?: string;
  details?: string;
  dryRun?: boolean;
}

export interface BotStatus {
  status: string;
  actionsCount: number;
  lastAction: BotAction | null;
}

export interface BotAnalysis {
  timestamp: string;
  buyingPower: number;
  suggestions: Array<{
    type: string;
    symbol: string;
    reason: string;
    priority: string;
  }>;
  holdings: Array<{
    symbol: string;
    quantity: number;
    averageCost: number;
    currentPrice: number;
    gainPercent: number;
    value: number;
  }>;
}

export interface Quote {
  symbol: string;
  price: number;
  bidPrice: number;
  askPrice: number;
  previousClose: number;
}

// ---------- helpers ----------

async function fetchEngine<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${ENGINE_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ---------- Transform engine responses to UI types ----------

function transformPosition(p: Record<string, unknown>): Position {
  const qty = Number(p.qty || p.quantity || 0);
  const avgEntry = Number(p.avg_entry || p.averageCost || 0);
  const currentPrice = Number(p.current_price || avgEntry);
  const totalCost = qty * avgEntry;
  const currentValue = Number(p.market_value || qty * currentPrice);
  const gain = Number(p.unrealized_pl || currentValue - totalCost);
  const gainPctRaw = Number(p.unrealized_pl_pct || (totalCost > 0 ? gain / totalCost : 0));
  // Engine returns decimal (0.05 = 5%), UI expects percentage
  const gainPercent = Math.abs(gainPctRaw) < 1 ? gainPctRaw * 100 : gainPctRaw;

  return {
    symbol: String(p.symbol || ''),
    name: String(p.name || p.symbol || ''),
    quantity: qty,
    averageCost: avgEntry,
    currentPrice,
    totalCost: Math.round(totalCost * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    gain: Math.round(gain * 100) / 100,
    gainPercent: Math.round(gainPercent * 100) / 100,
  };
}

function transformOrder(o: Record<string, unknown>): Order {
  return {
    id: String(o.id || o.order_id || ''),
    symbol: String(o.symbol || ''),
    name: String(o.name || o.symbol || ''),
    side: (String(o.side || '').toLowerCase()) as 'buy' | 'sell',
    type: String(o.type || o.order_type || 'market'),
    quantity: Number(o.qty || o.quantity || o.filled_quantity || 0),
    price: Number(o.price || o.limit_price || 0),
    state: String(o.state || o.status || 'unknown'),
    createdAt: String(o.created_at || o.createdAt || ''),
    updatedAt: String(o.updated_at || o.updatedAt || ''),
  };
}

// ---------- Portfolio functions (from engine API) ----------

export async function getPortfolio(): Promise<Portfolio> {
  const data = await fetchEngine<Record<string, unknown>>('/portfolio/robinhood');
  const rawPositions = (data.positions || []) as Record<string, unknown>[];
  const positions = rawPositions.map(transformPosition);
  const totalGain = positions.reduce((sum, p) => sum + p.gain, 0);

  return {
    accountNumber: '',
    buyingPower: Number(data.buying_power || 0),
    cash: Number(data.cash || 0),
    portfolioValue: Number(data.portfolio_value || data.equity || 0),
    extendedHoursValue: 0,
    totalGain: Math.round(totalGain * 100) / 100,
    positions,
  };
}

export async function getOrders(): Promise<Order[]> {
  const data = await fetchEngine<{ orders: Record<string, unknown>[] }>('/orders/history/robinhood?limit=50');
  return (data.orders || []).map(transformOrder);
}

export async function getOrderPnL(): Promise<OrderPnL> {
  const data = await fetchEngine<Record<string, unknown>>('/pnl/robinhood?days=365');
  const symbols = ((data.symbols || []) as Record<string, unknown>[]).map((s) => ({
    symbol: String(s.symbol || ''),
    name: String(s.name || s.symbol || ''),
    realizedPnL: Number(s.realizedPnL || 0),
    totalBought: Number(s.totalBought || 0),
    totalSold: Number(s.totalSold || 0),
    buyCount: Number(s.buyCount || 0),
    sellCount: Number(s.sellCount || 0),
    avgBuyPrice: Number(s.avgBuyPrice || 0),
    avgSellPrice: Number(s.avgSellPrice || 0),
    remainingShares: Number(s.remainingShares || 0),
    remainingCostBasis: Number(s.remainingCostBasis || 0),
  }));

  let orders: FilledOrder[] = [];
  try {
    const historyData = await fetchEngine<{ orders: Record<string, unknown>[] }>('/orders/history/robinhood?limit=100');
    orders = (historyData.orders || [])
      .filter((o) => o.state === 'filled')
      .map((o) => ({
        id: String(o.id || ''),
        symbol: String(o.symbol || ''),
        name: String(o.name || o.symbol || ''),
        side: (String(o.side || '').toLowerCase()) as 'buy' | 'sell',
        quantity: Number(o.filled_quantity || o.quantity || 0),
        price: Number(o.price || 0),
        total: Number(o.price || 0) * Number(o.filled_quantity || o.quantity || 0),
        createdAt: String(o.created_at || o.createdAt || ''),
      }));
  } catch {
    // fall back to empty
  }

  return {
    totalRealizedPnL: Number(data.totalRealizedPnL || 0),
    totalBuyVolume: Number(data.totalBuyVolume || 0),
    totalSellVolume: Number(data.totalSellVolume || 0),
    symbols,
    orders,
  };
}

// Order Book Snapshot — still from Netlify function (reads from blobs)
export async function getOrderBookSnapshot(): Promise<OrderBookSnapshot> {
  return fetchEngine<OrderBookSnapshot>("/snapshot");
}

// Redis Orders — still from Netlify function
export interface RedisOrders {
  openOrders: SnapshotOrder[];
  openOptionOrders: SnapshotOptionOrder[];
  historicalOrders: SnapshotOrder[];
  historicalOptionOrders: SnapshotOptionOrder[];
}

const OPEN_STATES = new Set(['queued', 'confirmed', 'pending', 'partially_filled', 'unconfirmed']);

export async function getRedisOrders(): Promise<RedisOrders> {
  const openOrders: SnapshotOrder[] = [];
  const openOptionOrders: SnapshotOptionOrder[] = [];
  const historicalOrders: SnapshotOrder[] = [];
  const historicalOptionOrders: SnapshotOptionOrder[] = [];

  try {
    // Stock orders from engine
    const data = await fetchEngine<{ orders: Record<string, unknown>[] }>("/orders/history/robinhood?limit=200");
    for (const o of (data.orders || [])) {
      const mapped: SnapshotOrder = {
        order_id: String(o.id || ''),
        symbol: String(o.symbol || ''),
        side: String(o.side || ''),
        order_type: String(o.type || 'market'),
        trigger: 'immediate',
        state: String(o.state || ''),
        quantity: Number(o.quantity || o.filled_quantity || 0),
        limit_price: Number(o.limit_price || 0),
        stop_price: o.stop_price ? Number(o.stop_price) : null,
        average_price: o.price ? Number(o.price) : undefined,
        filled_quantity: o.filled_quantity ? Number(o.filled_quantity) : undefined,
        created_at: String(o.created_at || ''),
        updated_at: String(o.updated_at || ''),
      };
      if (OPEN_STATES.has(mapped.state)) {
        openOrders.push(mapped);
      } else {
        historicalOrders.push(mapped);
      }
    }

    // Option orders from engine
    try {
      const optData = await fetchEngine<{ orders: Record<string, unknown>[] }>("/options/orders/robinhood?limit=100");
      for (const o of (optData.orders || [])) {
        const mapped: SnapshotOptionOrder = {
          order_id: String(o.order_id || ''),
          state: String(o.state || ''),
          quantity: Number(o.quantity || 0),
          price: Number(o.price || 0),
          premium: Number(o.premium || 0),
          processed_premium: Number(o.processed_premium || 0),
          direction: String(o.direction || ''),
          order_type: String(o.order_type || ''),
          trigger: String(o.trigger || ''),
          time_in_force: String(o.time_in_force || ''),
          opening_strategy: String(o.opening_strategy || ''),
          created_at: String(o.created_at || ''),
          updated_at: String(o.updated_at || ''),
          legs: (o.legs || []) as SnapshotOptionOrderLeg[],
        };
        if (OPEN_STATES.has(mapped.state)) {
          openOptionOrders.push(mapped);
        } else {
          historicalOptionOrders.push(mapped);
        }
      }
    } catch {
      // options not available
    }
  } catch {
    // fall back to empty
  }

  const byDateDesc = (a: { created_at: string }, b: { created_at: string }) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

  openOrders.sort(byDateDesc);
  openOptionOrders.sort(byDateDesc);
  historicalOrders.sort(byDateDesc);
  historicalOptionOrders.sort(byDateDesc);

  return { openOrders, openOptionOrders, historicalOrders, historicalOptionOrders };
}

export function sendSlackAlert(_message: string, _error?: string) {
  // Slack alerts handled server-side by the engine
}

// ---------- Bot functions (from engine API) ----------

export async function getBotStatus(): Promise<BotStatus> {
  const data = await fetchEngine<Record<string, unknown>>('/engine/status');
  return {
    status: data.running ? 'running' : 'idle',
    actionsCount: Number(data.tick_count || 0),
    lastAction: null,
  };
}

export async function getBotActions(limit: number = 50): Promise<{ actions: BotAction[]; total: number }> {
  try {
    const data = await fetchEngine<{ orders: Record<string, unknown>[] }>(`/orders/history/robinhood?limit=${limit}`);
    const actions: BotAction[] = (data.orders || []).map((o) => ({
      id: String(o.id || ''),
      timestamp: String(o.created_at || o.createdAt || ''),
      type: String(o.side || '').toUpperCase() === 'BUY' ? 'BUY_ORDER' : 'SELL_ORDER',
      status: String(o.state || '') === 'filled' ? 'completed' : String(o.state || ''),
      symbol: String(o.symbol || ''),
      quantity: Number(o.filled_quantity || o.quantity || 0),
      price: Number(o.price || 0),
      total: Number(o.price || 0) * Number(o.filled_quantity || o.quantity || 0),
    }));
    return { actions, total: actions.length };
  } catch {
    return { actions: [], total: 0 };
  }
}

export async function analyzePortfolio(): Promise<BotAnalysis> {
  const portfolio = await getPortfolio();
  const suggestions = portfolio.positions
    .filter((p) => Math.abs(p.gainPercent) > 10)
    .map((p) => ({
      type: p.gainPercent > 10 ? 'TAKE_PROFIT' : 'STOP_LOSS',
      symbol: p.symbol,
      reason: p.gainPercent > 10
        ? `Up ${p.gainPercent.toFixed(1)}% — consider taking profits`
        : `Down ${p.gainPercent.toFixed(1)}% — consider stop loss`,
      priority: Math.abs(p.gainPercent) > 20 ? 'high' : 'medium',
    }));

  return {
    timestamp: new Date().toISOString(),
    buyingPower: portfolio.buyingPower,
    suggestions,
    holdings: portfolio.positions.map((p) => ({
      symbol: p.symbol,
      quantity: p.quantity,
      averageCost: p.averageCost,
      currentPrice: p.currentPrice,
      gainPercent: p.gainPercent,
      value: p.currentValue,
    })),
  };
}

export async function getQuote(symbol: string): Promise<Quote> {
  return fetchEngine<Quote>(`/quote/${encodeURIComponent(symbol)}`);
}

export async function placeOrder(
  symbol: string,
  side: 'buy' | 'sell',
  quantity: number,
  dryRun: boolean = true
): Promise<{ status: string; message?: string; orderId?: string }> {
  return fetchEngine('/trade/order', {
    method: 'POST',
    body: JSON.stringify({
      symbol,
      side: side.toUpperCase(),
      quantity,
      dryRun,
      dry_run: dryRun,
    }),
  });
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format percentage
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Get color class based on value
export function getGainColor(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}

// Get background color class based on value
export function getGainBgColor(value: number): string {
  if (value > 0) return 'bg-green-100';
  if (value < 0) return 'bg-red-100';
  return 'bg-gray-100';
}

// Auth functions (from engine API)
export async function getAuthStatus(): Promise<AuthStatus> {
  try {
    const data = await fetchEngine<Record<string, unknown>>('/auth/status/robinhood');
    return {
      authenticated: Boolean(data.authenticated),
      message: data.authenticated ? 'Connected to Robinhood' : 'Not authenticated',
      error: data.error ? String(data.error) : undefined,
    };
  } catch (e) {
    return {
      authenticated: false,
      message: 'Unable to reach engine API',
      error: String(e),
    };
  }
}

export async function connectRobinhood(): Promise<AuthResult> {
  return { authenticated: false, message: 'Use pickle-based auth via scripts/refresh_pickle.py' };
}

export async function checkVerification(): Promise<AuthResult & { status?: string; elapsedSeconds?: number }> {
  const status = await getAuthStatus();
  return { ...status, status: status.authenticated ? 'approved' : 'pending' };
}

export async function submitMFA(_code: string): Promise<AuthResult> {
  return { authenticated: false, message: 'MFA not supported via engine API — use pickle auth' };
}

export async function disconnectRobinhood(): Promise<AuthResult> {
  return { authenticated: false, message: 'Disconnected' };
}
