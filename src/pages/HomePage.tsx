import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Flight Route Manager</h1>
        <p className="text-lg text-gray-600 mb-12">Track and analyze flight prices across different routes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Search Flights" 
            description="Find the best flight options for your next trip"
            to="/search"
          />
          <Card 
            title="Price Trends" 
            description="Analyze price history and trends for your routes"
            to="/trends"
          />
          <Card 
            title="Route Summary" 
            description="View and compare price trends across all routes"
            to="/route-summary"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link 
      to={to}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
    >
      <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
