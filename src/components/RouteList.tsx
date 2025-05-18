import React, { useEffect, useState } from 'react';
import { Route, getRoutes } from '../services/api';
import { RouteCard } from './RouteCard';

export const RouteList: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await getRoutes();
        setRoutes(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch routes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Available Routes</h1>
      {routes.length === 0 ? (
        <p className="text-gray-500">No routes available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      )}
    </div>
  );
};
