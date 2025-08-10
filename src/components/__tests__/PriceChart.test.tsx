import { render, screen } from '@testing-library/react';
import { PriceChart } from '../PriceChart';
import { FlightPrice } from '../../services/api';

// Simple mock for Recharts to avoid complex setup
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="recharts-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

describe('PriceChart Component', () => {
  // Sample test data
  const samplePrices: FlightPrice[] = [
    { price: 450, date: '2025-05-18' },
    { price: 500, date: '2025-05-19' },
    { price: 425, date: '2025-05-20' },
  ];
  
  const basePrice = 475;
  const lowestPrice = 425;
  const highestPrice = 525;
  
  it('renders empty state when no prices are provided', () => {
    render(
      <PriceChart 
        prices={[]} 
        basePrice={basePrice} 
        lowestPrice={lowestPrice} 
        highestPrice={highestPrice} 
      />
    );
    
    // Check that empty state message is shown
    expect(screen.getByText('No price data available')).toBeInTheDocument();
  });
});
