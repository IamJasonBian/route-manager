import * as fs from 'fs';
import * as path from 'path';

export interface FlightPrice {
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  currency: string;
  flightNumber?: string;
  // Add other fields as needed
}

const SNAPSHOTS_DIR = path.join(process.cwd(), 'data', 'snapshots');

// Ensure the snapshots directory exists
export function ensureSnapshotsDir() {
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
}

// Generate a filename for the snapshot
export function getSnapshotFilename(date: Date = new Date()): string {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(SNAPSHOTS_DIR, `prices_${dateStr}.json`);
}

// Save prices to a daily snapshot
export async function savePriceSnapshot(prices: FlightPrice[]): Promise<string> {
  ensureSnapshotsDir();
  
  const snapshot = {
    timestamp: new Date().toISOString(),
    data: prices
  };
  
  const filename = getSnapshotFilename();
  await fs.promises.writeFile(filename, JSON.stringify(snapshot, null, 2));
  
  return filename;
}

// Load the latest snapshot
export async function loadLatestSnapshot(): Promise<FlightPrice[] | null> {
  ensureSnapshotsDir();
  
  try {
  const files = fs.readdirSync(SNAPSHOTS_DIR)
    .filter((file: string) => file.startsWith('prices_') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) return null;
    
    const latestFile = path.join(SNAPSHOTS_DIR, files[0]);
    const content = await fs.promises.readFile(latestFile, 'utf-8');
    const { data } = JSON.parse(content);
    
    return data;
  } catch (error) {
    console.error('Error loading snapshot:', error);
    return null;
  }
}

// Aggregate prices by route and date
export function aggregatePrices(prices: FlightPrice[]): Record<string, Array<{date: string, price: number}>> {
  const result: Record<string, Array<{date: string, price: number}>> = {};
  
  prices.forEach(price => {
    const key = `${price.origin}-${price.destination}`;
    const date = new Date(price.departureDate).toISOString().split('T')[0];
    
    if (!result[key]) {
      result[key] = [];
    }
    
    // Only add if we don't already have a price for this date
    if (!result[key].some(item => item.date === date)) {
      result[key].push({
        date,
        price: price.price
      });
    }
  });
  
  // Sort each route's prices by date
  Object.values(result).forEach(prices => {
    prices.sort((a, b) => a.date.localeCompare(b.date));
  });
  
  return result;
}
