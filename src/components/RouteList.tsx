import React, { useEffect, useState, useCallback } from 'react';
import { Route, getRoutes } from '../services/api';
import { RouteCard } from './RouteCard';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton loader for route cards
const RouteCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-12 w-20 rounded-lg" />
    </div>
    <Skeleton className="h-40 w-full rounded-md" />
  </div>
);

export const RouteList: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedRoutes, setLoadedRoutes] = useState<{[key: string]: boolean}>({});

  // Load routes data
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await getRoutes();
        
        // Initialize loaded state for each route
        const initialLoadedState = data.reduce((acc, route) => ({
          ...acc,
          [route.id]: false
        }), {});
        
        setRoutes(data);
        setLoadedRoutes(initialLoadedState);
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
  
  // Memoize the route load handler to prevent unnecessary re-renders
  const handleRouteLoad = useCallback((routeId: string) => {
    setLoadedRoutes(prev => ({
      ...prev,
      [routeId]: true
    }));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Available Routes</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <RouteCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
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
            <div key={route.id} className="relative">
              {!loadedRoutes[route.id] && (
                <div className="absolute inset-0 z-10">
                  <RouteCardSkeleton />
                </div>
              )}
              <div className={!loadedRoutes[route.id] ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <RouteCard 
                  key={route.id}
                  route={route} 
                  onLoad={() => handleRouteLoad(route.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
