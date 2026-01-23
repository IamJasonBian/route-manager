import { useState, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bot,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  getPortfolio,
  getBotActions,
  analyzePortfolio,
  Portfolio,
  BotAction,
  BotAnalysis,
  formatCurrency,
  formatPercent,
  getGainColor,
} from '../services/robinhoodService';

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

function PortfolioSummary({ portfolio }: { portfolio: Portfolio }) {
  const dayGainPercent = portfolio.portfolioValue > 0
    ? (portfolio.totalGain / (portfolio.portfolioValue - portfolio.totalGain)) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <DollarSign className="w-4 h-4" />
          Portfolio Value
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(portfolio.portfolioValue)}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          {portfolio.totalGain >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          Day's Change
        </div>
        <div className={`text-2xl font-bold ${getGainColor(portfolio.totalGain)}`}>
          {formatCurrency(portfolio.totalGain)} ({formatPercent(dayGainPercent)})
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <Activity className="w-4 h-4" />
          Buying Power
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(portfolio.buyingPower)}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <BarChart3 className="w-4 h-4" />
          Positions
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {portfolio.positions.length}
        </div>
      </div>
    </div>
  );
}

function PortfolioAllocation({ portfolio }: { portfolio: Portfolio }) {
  const pieData = portfolio.positions.map((pos, index) => ({
    name: pos.symbol,
    value: pos.currentValue,
    color: COLORS[index % COLORS.length],
  }));

  // Add cash/buying power if significant
  if (portfolio.buyingPower > 0) {
    pieData.push({
      name: 'Cash',
      value: portfolio.buyingPower,
      color: '#9CA3AF',
    });
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0];
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const percent = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
        <p className="text-sm text-gray-500">{percent}%</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function PositionsTable({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {portfolio.positions.map((position, index) => (
              <tr key={position.symbol} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{position.symbol}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[150px]">{position.name}</div>
                </td>
                <td className="px-4 py-3 text-right text-gray-900">{position.quantity.toFixed(4)}</td>
                <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(position.currentPrice)}</td>
                <td className="px-4 py-3 text-right text-gray-500">{formatCurrency(position.averageCost)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(position.currentValue)}</td>
                <td className="px-4 py-3 text-right">
                  <div className={`font-medium ${getGainColor(position.gain)}`}>
                    {formatCurrency(position.gain)}
                  </div>
                  <div className={`text-sm ${getGainColor(position.gainPercent)}`}>
                    {formatPercent(position.gainPercent)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BotActionsLog({ actions }: { actions: BotAction[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'simulated':
        return <Bot className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUY_ORDER':
        return 'bg-green-100 text-green-800';
      case 'SELL_ORDER':
        return 'bg-red-100 text-red-800';
      case 'ANALYSIS':
        return 'bg-blue-100 text-blue-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <Bot className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Bot Activity</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {actions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No bot actions yet</p>
            <p className="text-sm">Run an analysis to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {actions.map((action) => (
              <div key={action.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  {getStatusIcon(action.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(action.type)}`}>
                        {action.type.replace('_', ' ')}
                      </span>
                      {action.symbol && (
                        <span className="font-medium text-gray-900">{action.symbol}</span>
                      )}
                      {action.dryRun && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                          DRY RUN
                        </span>
                      )}
                    </div>
                    {action.quantity && action.price && (
                      <p className="text-sm text-gray-600 mt-1">
                        {action.quantity} shares @ {formatCurrency(action.price)} = {formatCurrency(action.total || 0)}
                      </p>
                    )}
                    {action.message && (
                      <p className="text-sm text-gray-600 mt-1">{action.message}</p>
                    )}
                    {action.details && (
                      <p className="text-sm text-gray-600 mt-1">{action.details}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(action.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisSuggestions({ analysis }: { analysis: BotAnalysis | null }) {
  if (!analysis) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Bot Suggestions</h3>
      </div>
      {analysis.suggestions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
          <p>No action needed</p>
          <p className="text-sm">Your portfolio looks balanced</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                  suggestion.type === 'TAKE_PROFIT' ? 'bg-green-100 text-green-800' :
                  suggestion.type === 'STOP_LOSS' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {suggestion.type.replace('_', ' ')}
                </span>
                <span className="font-medium text-gray-900">{suggestion.symbol}</span>
                <span className={`ml-auto px-2 py-0.5 text-xs rounded ${
                  suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">{suggestion.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [botActions, setBotActions] = useState<BotAction[]>([]);
  const [analysis, setAnalysis] = useState<BotAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [portfolioData, actionsData] = await Promise.all([
        getPortfolio(),
        getBotActions(50),
      ]);
      setPortfolio(portfolioData);
      setBotActions(actionsData.actions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const analysisData = await analyzePortfolio();
      setAnalysis(analysisData);
      // Refresh actions after analysis
      const actionsData = await getBotActions(50);
      setBotActions(actionsData.actions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-300" />
          <p className="text-lg font-medium text-red-600 mb-2">{error}</p>
          <p className="text-gray-500 mb-4">
            Make sure RH_USER and RH_PASS environment variables are set in Netlify
          </p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade</h1>
          <p className="text-gray-500 mt-1">
            Robinhood portfolio and trading bot activity
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
          >
            <Bot className={`w-4 h-4 ${analyzing ? 'animate-pulse' : ''}`} />
            {analyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {portfolio && (
        <>
          <PortfolioSummary portfolio={portfolio} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PortfolioAllocation portfolio={portfolio} />
            <AnalysisSuggestions analysis={analysis} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PositionsTable portfolio={portfolio} />
            </div>
            <div>
              <BotActionsLog actions={botActions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
