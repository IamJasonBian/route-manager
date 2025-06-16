import { render, screen } from '@testing-library/react';
import { RouteCard } from '../RouteCard';
import { Route } from '../../services/api';

describe.skip('RouteCard Component', () => {
  // Sample test data
  const sampleRoute: Route = {
    id: '1',
    from: 'JFK',
    to: 'LHR',
    distance: '3,461 miles',
    duration: '7h 25m',
    prices: [
      { price: 450, date: '2025-05-18' },
      { price: 500, date: '2025-05-19' },
      { price: 425, date: '2025-05-20' },
      { price: 475, date: '2025-05-21' },
      { price: 525, date: '2025-05-22' },
    ],
    basePrice: 475
  };
  
  it('renders route information correctly', () => {
    render(<RouteCard route={sampleRoute} />);
    
    // Check that route cities are displayed
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    
    // Check that airport codes are displayed
    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('LHR')).toBeInTheDocument();
    
    // Check that flight details are displayed
    expect(screen.getByText('3,461 miles')).toBeInTheDocument();
    expect(screen.getByText('7h 25m')).toBeInTheDocument();
    
    // Check that price information is displayed
    expect(screen.getByText('$425')).toBeInTheDocument();
    expect(screen.getByText('Save $50')).toBeInTheDocument();
  });
  
  it('renders Google Flights link correctly', () => {
    render(<RouteCard route={sampleRoute} />);
    
    // Check that Google Flights link is present
    const link = screen.getByText('View on Google Flights');
    expect(link).toBeInTheDocument();
    
    // Check that link has correct attributes
    expect(link.closest('a')).toHaveAttribute('href', expect.stringContaining('google.com/flights'));
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });
  
  it('renders PriceChart component with correct props', () => {
    // Mock PriceChart component
    jest.mock('../PriceChart', () => ({
      PriceChart: (props: any) => <div data-testid="price-chart" data-props={JSON.stringify(props)} />
    }));
    
    const { container } = render(<RouteCard route={sampleRoute} />);
    
    // Check that PriceChart is rendered
    expect(container.querySelector('.h-52')).toBeInTheDocument();
  });
});
