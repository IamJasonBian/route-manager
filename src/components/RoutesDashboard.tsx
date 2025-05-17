import React from 'react';
import { RouteCard } from './RouteCard';
export const RoutesDashboard = ({
  routes
}) => {
  const totalRoutes = routes.length;
  const cheapestPrice = Math.min(...routes.flatMap(route => route.prices.map(p => p.price)));
  return <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Routes Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">Available Routes</p>
            <p className="text-2xl font-bold text-blue-800">{totalRoutes}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-700">Cheapest Price</p>
            <p className="text-2xl font-bold text-green-800">
              ${cheapestPrice}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Price Charts</h2>
          <div className="text-sm text-gray-500">
            Showing {routes.length} routes
          </div>
        </div>
        <div className="space-y-6">
          {routes.length > 0 ? routes.map(route => <RouteCard key={route.id} route={route} />) : <p className="text-gray-500 text-center py-8">
              No routes available
            </p>}
        </div>
      </div>
    </div>;
};