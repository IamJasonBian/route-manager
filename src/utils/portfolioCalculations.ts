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
export function mergeReturnsForChart(
  portfolioReturns: PortfolioReturnData[]
): Array<Record<string, string | number>> {
  if (portfolioReturns.length === 0) return [];

  // Use the first asset's dates as the base timeline
  const baseAsset = portfolioReturns[0];

  return baseAsset.returns.map((point, index) => {
    const dataPoint: Record<string, string | number> = {
      date: point.date,
      timestamp: point.timestamp,
    };

    portfolioReturns.forEach((asset) => {
      if (asset.returns[index]) {
        dataPoint[asset.symbol] = Number(asset.returns[index].returnPercent.toFixed(2));
      }
    });

    return dataPoint;
  });
}

// Format percentage for display
export function formatReturnPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
