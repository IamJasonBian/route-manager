import { useState, useEffect } from 'react';
import { Calendar, TrendingDown, TrendingUp, ArrowDown, RefreshCw } from 'lucide-react';
import {
  fetchWeekendMomentumData,
  WeekendMomentumResult,
  WeekendMetrics,
  WeekendData,
} from '../services/weekendMomentumService';

function MetricCard({
  label,
  value,
  suffix = '%',
  isNegative,
}: {
  label: string;
  value: number;
  suffix?: string;
  isNegative?: boolean;
}) {
  const color =
    isNegative === undefined
      ? 'text-gray-900'
      : isNegative
        ? 'text-red-600'
        : 'text-green-600';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value.toFixed(2)}{suffix}
      </p>
    </div>
  );
}

function MetricsGrid({ metrics, label }: { metrics: WeekendMetrics; label: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        {label}
        <span className="text-sm font-normal text-gray-500">
          ({metrics.totalWeekends} weekends)
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          label="Mon opened below Fri close"
          value={metrics.monBelowFriPct}
          isNegative={metrics.monBelowFriPct > 50}
        />
        <MetricCard
          label="Avg Fri→Sun drift"
          value={metrics.avgFriSunDrift}
          isNegative={metrics.avgFriSunDrift < 0}
        />
        <MetricCard
          label="Avg weekend drawdown"
          value={metrics.avgWeekendDrawdown}
          isNegative={true}
        />
        <MetricCard
          label="Worst weekend drawdown"
          value={metrics.worstWeekendDrawdown}
          isNegative={true}
        />
        <MetricCard
          label="Monday recovery positive"
          value={metrics.mondayRecoveryPositivePct}
          isNegative={metrics.mondayRecoveryPositivePct < 50}
        />
      </div>
    </div>
  );
}

function WeekendTable({ weekends }: { weekends: WeekendData[] }) {
  const [page, setPage] = useState(0);
  const perPage = 20;
  const totalPages = Math.ceil(weekends.length / perPage);

  // Show most recent first
  const sorted = [...weekends].reverse();
  const slice = sorted.slice(page * perPage, (page + 1) * perPage);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Weekend History</h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Friday</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Fri Close</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Sun Close</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Mon Open</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Mon Close</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Fri→Sun</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Drawdown</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Mon&lt;Fri</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Recovery</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((w) => (
                <tr key={w.fridayDate} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{w.fridayDate}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    ${w.fridayClose.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {w.sundayClose !== null
                      ? `$${w.sundayClose.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    ${w.mondayOpen.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    ${w.mondayClose.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-medium ${
                    w.friToSunDrift !== null && w.friToSunDrift >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {w.friToSunDrift !== null ? `${w.friToSunDrift >= 0 ? '+' : ''}${w.friToSunDrift.toFixed(2)}%` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-red-600">
                    {w.weekendDrawdown.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {w.monBelowFri ? (
                      <ArrowDown className="w-4 h-4 text-red-500 inline" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-500 inline" />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {w.mondayRecoveryPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500 inline" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeekendMomentum() {
  const [data, setData] = useState<WeekendMomentumResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeekendMomentumData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weekend data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-orange-500 animate-pulse mx-auto mb-3" />
          <p className="text-gray-600">Loading weekend momentum data...</p>
          <p className="text-sm text-gray-400 mt-1">Fetching BTC + GBTC history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekend Momentum</h2>
        <p className="text-gray-500">
          BTC weekend price behavior analysis — how Bitcoin performs from Friday close through
          Monday open/close.
        </p>
      </div>

      <MetricsGrid metrics={data.allHistory.metrics} label="All BTC History" />

      <MetricsGrid
        metrics={data.gbtcEra.metrics}
        label={`GBTC Era (since ${data.gbtcEra.startDate})`}
      />

      <WeekendTable weekends={data.allHistory.weekends} />
    </div>
  );
}
