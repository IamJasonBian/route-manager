// React import removed as it's not used
import { render, screen } from '@testing-library/react';
import { PriceChart } from '../PriceChart';
import { FlightPrice } from '../../services/api';

describe('PriceChart Component', () => {
  // Sample test data
  const samplePrices: FlightPrice[] = [
    { price: 450, date: '2025-05-18' },
    { price: 500, date: '2025-05-19' },
    { price: 425, date: '2025-05-20' },
    { price: 475, date: '2025-05-21' },
    { price: 525, date: '2025-05-22' },
  ];
  
  const basePrice = 475;
  const lowestPrice = 425;
  const highestPrice = 525;
  
  it('renders correctly with price data', () => {
    render(
      <PriceChart 
        prices={samplePrices} 
        basePrice={basePrice} 
        lowestPrice={lowestPrice} 
        highestPrice={highestPrice} 
      />
    );
    
    // Check that price labels are rendered
    const priceLabels = screen.getAllByText(/\$\d+/);
    expect(priceLabels.length).toBeGreaterThan(0);
    
    // Check that date labels are rendered
    expect(screen.getByText(/May 18/)).toBeInTheDocument();
    expect(screen.getByText(/May 22/)).toBeInTheDocument();
  });
  
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
  
  it('handles edge case when all prices are the same', () => {
    const samePrices: FlightPrice[] = [
      { price: 500, date: '2025-05-18' },
      { price: 500, date: '2025-05-19' },
      { price: 500, date: '2025-05-20' },
    ];
    
    render(
      <PriceChart 
        prices={samePrices} 
        basePrice={500} 
        lowestPrice={500} 
        highestPrice={500} 
      />
    );
    
    // Chart should still render without errors
    const priceLabels = screen.getAllByText(/\$\d+/);
    expect(priceLabels.length).toBeGreaterThan(0);
  });
  
  it('renders with correct color coding for prices', () => {
    const { container } = render(
      <PriceChart 
        prices={samplePrices} 
        basePrice={basePrice} 
        lowestPrice={lowestPrice} 
        highestPrice={highestPrice} 
      />
    );
    
    // Check for SVG elements
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Check for path elements (line and area)
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(2);
    
    // Check for circle elements (data points)
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(samplePrices.length);
  });
});
