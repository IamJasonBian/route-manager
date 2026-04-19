import React, { useCallback } from 'react';
import { Route as RouteType, ApiRoute } from '../services/api';
import { RouteCard } from './RouteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { defaultRoutes } from '../config/defaultRoutes';

interface RouteListProps {
  routes: RouteType[];
}

const RouteCardSkeleton = () => (
  <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
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
  const [loadedRoutes, setLoadedRoutes] = React.useState<{[key: string]: boolean}>({});

  const handleRouteLoad = useCallback((routeId: string) => {
    setLoadedRoutes(prev => ({ ...prev, [routeId]: true }));
  }, []);

  React.useEffect(() => {
    const newLoadedRoutes = routes.reduce((acc, route) => ({
      ...acc,
      [route.id]: loadedRoutes[route.id] || false
    }), {});
    setLoadedRoutes(newLoadedRoutes);
  }, [routes]);

  const loading = routes.length === 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Available Routes</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <RouteCardSkeleton key={`skeleton-${i}`} />)}
        </div>
      </div>
    );
  }

  const hasRoutes = routes.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {hasRoutes ? 'Available Routes' : 'Popular Routes'}
        </h1>
        {!hasRoutes && (
          <span className="text-sm text-[var(--muted)] bg-[var(--muted-bg)] px-3 py-1 rounded-full">
            Default Routes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hasRoutes ? (
          routes.map((route) => (
            <div key={route.id} className="relative">
              {!loadedRoutes[route.id] && (
                <div className="absolute inset-0 z-10"><RouteCardSkeleton /></div>
              )}
              <div className={!loadedRoutes[route.id] ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <RouteCard route={route} onLoad={() => handleRouteLoad(route.id)} />
              </div>
            </div>
          ))
        ) : (
          defaultRoutes.map((defaultRoute: Omit<ApiRoute, 'id'>, index: number) => (
            <div key={`default-${index}`} className="border-2 border-dashed border-[var(--border)] rounded-lg p-4 bg-[var(--card)] hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-[var(--foreground)] font-mono">
                    {defaultRoute.from} &rarr; {defaultRoute.to}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {defaultRoute.duration} &middot; {defaultRoute.distance}
                  </p>
                </div>
                <span className="bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium font-mono px-2.5 py-0.5 rounded">
                  ${defaultRoute.basePrice}
                </span>
              </div>
              <div className="h-32 bg-[var(--muted-bg)] rounded-md flex items-center justify-center text-[var(--muted)] text-sm">
                Save this route to see detailed information
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
