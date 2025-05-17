import React, { useState } from 'react';
import { RoutesDashboard } from './components/RoutesDashboard';
import { AddRouteForm } from './components/AddRouteForm';
import { PlaneTakeoffIcon } from 'lucide-react';
// Helper to generate sample prices for 4 months
const generatePrices = (basePrice: number) => {
  const today = new Date();
  const prices = [];
  for (let i = 0; i < 4; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i);
    const monthPrices = Array.from({
      length: 7
    }, (_, index) => ({
      date: new Date(month.getFullYear(), month.getMonth(), (index + 1) * 4),
      price: basePrice + Math.floor(Math.random() * 200) - 100
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
    prices.push(...monthPrices);
  }
  return prices;
};
export function App() {
  const [routes, setRoutes] = useState([{
    id: 1,
    from: 'New York',
    to: 'London',
    basePrice: 550,
    prices: generatePrices(550),
    distance: '3,461 miles',
    duration: '7h 25m'
  }, {
    id: 2,
    from: 'New York',
    to: 'Seattle',
    basePrice: 350,
    prices: generatePrices(350),
    distance: '2,852 miles',
    duration: '6h 15m'
  }, {
    id: 3,
    from: 'New York',
    to: 'Michigan',
    basePrice: 200,
    prices: generatePrices(200),
    distance: '632 miles',
    duration: '1h 45m'
  }]);
  const addRoute = route => {
    const newRoute = {
      ...route,
      id: routes.length + 1,
      prices: generatePrices(route.basePrice)
    };
    setRoutes([...routes, newRoute]);
  };
  return <div className="min-h-screen bg-slate-50 w-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <PlaneTakeoffIcon className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Route Price Manager</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RoutesDashboard routes={routes} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <AddRouteForm onAddRoute={addRoute} />
          </div>
        </div>
      </main>
    </div>;
}