import { NormalizedPriceData, PortfolioAsset } from '../services/twelveDataService';

export interface ReturnDataPoint {
  date: string;
  timestamp: number;
  returnPercent: number;
}

export interface PortfolioReturnData {
  symbol: string;
  displayName: string;
  color: string;
  returns: ReturnDataPoint[];
}

// Calculate percentage returns from price data (normalized to starting value = 0%)
export function calculateReturns(priceData: NormalizedPriceData[]): ReturnDataPoint[] {
  if (priceData.length === 0) return [];

  const startPrice = priceData[0].price;

  return priceData.map((point) => ({
    date: point.date,
    timestamp: point.timestamp,
    returnPercent: ((point.price - startPrice) / startPrice) * 100,
  }));
}

// Apply yearly fee deduction to returns
// Fee compounds daily, reducing effective returns over time
export function applyFees(
  returns: ReturnDataPoint[],
  yearlyFeePercent: number
): ReturnDataPoint[] {
  if (returns.length === 0 || yearlyFeePercent === 0) return returns;

  const dailyFeeRate = yearlyFeePercent / 100 / 365;

  return returns.map((point, index) => {
    // Fee compounds from day 0
    const feeMultiplier = Math.pow(1 - dailyFeeRate, index);
    // Apply fee to the gross return (1 + return%)
    const grossReturn = 1 + point.returnPercent / 100;
    const netReturn = grossReturn * feeMultiplier;
    const netReturnPercent = (netReturn - 1) * 100;

    return {
      ...point,
      returnPercent: netReturnPercent,
    };
  });
}

// Process portfolio assets into chart-ready data with fees applied
export function processPortfolioReturns(
  assets: PortfolioAsset[],
  fees: Record<string, number>
): PortfolioReturnData[] {
  return assets.map((asset) => {
    const rawReturns = calculateReturns(asset.data);
    const feePercent = fees[asset.symbol] || 0;
    const adjustedReturns = applyFees(rawReturns, feePercent);

    return {
      symbol: asset.symbol,
      displayName: asset.displayName,
      color: asset.color,
      returns: adjustedReturns,
    };
  });
}

// Merge multiple return series into a single dataset for Recharts
// Each data point has: date, timestamp, and a key for each asset's return
// Joins by DATE to handle assets with different trading calendars (e.g., BTC 24/7 vs stocks M-F)
export function mergeReturnsForChart(
  portfolioReturns: PortfolioReturnData[]
): Array<Record<string, string | number>> {
  if (portfolioReturns.length === 0) return [];

  // Build a map of date -> returns for each asset
  const returnsByDate = new Map<string, Record<string, number>>();
  const timestampByDate = new Map<string, number>();

  portfolioReturns.forEach((asset) => {
    asset.returns.forEach((point) => {
      if (!returnsByDate.has(point.date)) {
        returnsByDate.set(point.date, {});
        timestampByDate.set(point.date, point.timestamp);
      }
      returnsByDate.get(point.date)![asset.symbol] = Number(point.returnPercent.toFixed(2));
    });
  });

  // Get all dates sorted chronologically
  const allDates = Array.from(returnsByDate.keys()).sort(
    (a, b) => (timestampByDate.get(a) || 0) - (timestampByDate.get(b) || 0)
  );

  // Only include dates where ALL assets have data (common trading days)
  const assetSymbols = portfolioReturns.map((a) => a.symbol);

  return allDates
    .filter((date) => {
      const returns = returnsByDate.get(date)!;
      return assetSymbols.every((symbol) => symbol in returns);
    })
    .map((date) => {
      const dataPoint: Record<string, string | number> = {
        date,
        timestamp: timestampByDate.get(date) || 0,
        ...returnsByDate.get(date)!,
      };
      return dataPoint;
    });
}

// Format percentage for display
export function formatReturnPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
