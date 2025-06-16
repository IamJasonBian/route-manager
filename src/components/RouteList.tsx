import React, { useCallback } from 'react';
import { Route as RouteType, ApiRoute } from '../services/api';
import { RouteCard } from './RouteCard';
import { useSelectedRoutes } from '../context/SelectedRoutesContext';
import { Skeleton } from '@/components/ui/skeleton';
import { defaultRoutes } from '../config/defaultRoutes';

interface RouteListProps {
  routes: RouteType[];
}

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

export const RouteList: React.FC<RouteListProps> = ({ routes }) => {
  const { toggleRoute, isSelected } = useSelectedRoutes();
  const [loadedRoutes, setLoadedRoutes] = React.useState<{[key: string]: boolean}>({});
  
  // Memoize the route load handler to prevent unnecessary re-renders
  const handleRouteLoad = useCallback((routeId: string) => {
    setLoadedRoutes(prev => ({
      ...prev,
      [routeId]: true
    }));
  }, []);
  
  // Initialize loaded state for new routes
  React.useEffect(() => {
    const newLoadedRoutes = routes.reduce((acc, route) => ({
      ...acc,
      [route.id]: loadedRoutes[route.id] || false
    }), {});
    
    setLoadedRoutes(newLoadedRoutes);
  }, [routes]);
  
  const loading = routes.length === 0;
  const error = null; // Error is now handled by the parent component

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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Available Routes</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Check if we have any routes to display
  const hasRoutes = routes.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {hasRoutes ? 'Available Routes' : 'Popular Routes'}
        </h1>
        {!hasRoutes && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Default Routes
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hasRoutes ? (
          // Display saved routes
          routes.map((route) => (
            <div key={route.id} className="relative">
              {!loadedRoutes[route.id] && (
                <div className="absolute inset-0 z-10">
                  <RouteCardSkeleton />
                </div>
              )}
              <div className={!loadedRoutes[route.id] ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <RouteCard
                  route={route}
                  onLoad={() => handleRouteLoad(route.id)}
                  selected={isSelected(route.id)}
                  onToggleSelect={() => toggleRoute(route.id)}
                />
              </div>
            </div>
          ))
        ) : (
          // Display default routes with a different style
          defaultRoutes.map((defaultRoute: Omit<ApiRoute, 'id'>, index: number) => (
            <div key={`default-${index}`} className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {defaultRoute.from} → {defaultRoute.to}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {defaultRoute.duration} • {defaultRoute.distance}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  ${defaultRoute.basePrice}
                </span>
              </div>
              <div className="h-32 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 text-sm">
                Save this route to see detailed information
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
