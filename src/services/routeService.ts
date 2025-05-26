import { executeQuery } from './dbService';
import { ApiRoute as ApiRouteType } from './api';

// Database route interface
export interface DbRoute {
  id: number;
  origin: string;
  destination: string;
  price: number | null;
  departure_date: Date | null;
  return_date: Date | null;
  airline: string | null;
  flight_number: string | null;
  created_at: Date;
  updated_at: Date;
}

// API route interface
export interface ApiRoute {
  id: number;
  from: string;
  to: string;
  basePrice: number;
  prices: Array<{ date: Date; price: number }>;
  distance: string;
  duration: string;
  meta: {
    fromCode: string;
    toCode: string;
    source: string;
    lowestPrice?: number;
    highestPrice?: number;
    _error?: string;
  };
}

/**
 * Saves a route to the database
 * @param route The route data to save (without id, created_at, and updated_at)
 * @returns The saved route with all fields
 */
export const saveRoute = async (
  route: Omit<DbRoute, 'id' | 'created_at' | 'updated_at'>
): Promise<DbRoute> => {
  const { 
    origin, 
    destination, 
    price, 
    departure_date, 
    return_date, 
    airline, 
    flight_number 
  } = route;
  
  try {
    const result = await executeQuery<DbRoute>(
      `INSERT INTO routes (
        origin, 
        destination, 
        price, 
        departure_date, 
        return_date, 
        airline, 
        flight_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (origin, destination, departure_date, flight_number) 
      DO UPDATE SET 
        price = EXCLUDED.price,
        return_date = EXCLUDED.return_date,
        airline = EXCLUDED.airline,
        updated_at = NOW()
      RETURNING *`,
      [
        origin, 
        destination, 
        price, 
        departure_date, 
        return_date, 
        airline, 
        flight_number
      ]
    );

    if (!result.rows || result.rows.length === 0) {
      throw new Error('Failed to save route: No data returned from database');
    }

    return result.rows[0];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error saving route to database:', errorMessage);
    throw new Error(`Failed to save route: ${errorMessage}`);
  }
};

export const getRoutes = async (origin?: string, destination?: string): Promise<DbRoute[]> => {
  try {
    let query = 'SELECT * FROM routes';
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build query conditions based on parameters
    if (origin) {
      conditions.push(`origin = $${paramIndex++}`);
      params.push(origin);
    }
    
    if (destination) {
      conditions.push(`destination = $${paramIndex++}`);
      params.push(destination);
    }

    // Add conditions to query if any exist
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ORDER BY to ensure consistent results
    query += ' ORDER BY created_at DESC';

    console.log('Executing database query:', query);
    console.log('Query parameters:', params);
    
    const result = await executeQuery<DbRoute>(query, params);
    console.log('Database query result:', JSON.stringify(result, null, 2));
    
    // Ensure we're returning properly typed DbRoute objects
    const routes = result.rows.map(row => ({
      id: row.id,
      origin: row.origin,
      destination: row.destination,
      price: row.price,
      departure_date: row.departure_date ? new Date(row.departure_date) : null,
      return_date: row.return_date ? new Date(row.return_date) : null,
      airline: row.airline,
      flight_number: row.flight_number,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }));
    
    console.log('Processed routes:', JSON.stringify(routes, null, 2));
    return routes;
  } catch (error) {
    console.error('Error in getRoutes:', error);
    throw error;
  }
};

export const getRouteById = async (id: number): Promise<DbRoute | undefined> => {
  const result = await executeQuery<DbRoute>('SELECT * FROM routes WHERE id = $1', [id]);
  return result.rows[0];
};

export const deleteRoute = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM routes WHERE id = $1', [id]);
};

/**
 * Saves multiple routes to the database in a single transaction
 * @param routes Array of route data to save
 * @returns Array of saved routes with database IDs
 */
export const saveRoutes = async (routes: Omit<DbRoute, 'id' | 'created_at' | 'updated_at'>[]): Promise<DbRoute[]> => {
  // For serverless environment, we'll save routes one by one
  const savedRoutes: DbRoute[] = [];
  
  for (const route of routes) {
    try {
      const { rows } = await executeQuery<DbRoute>(
        `INSERT INTO routes (
          origin, destination, price, departure_date, return_date, airline, flight_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          route.origin,
          route.destination,
          route.price,
          route.departure_date,
          route.return_date,
          route.airline,
          route.flight_number
        ]
      );
      savedRoutes.push(rows[0]);
    } catch (error) {
      console.error(`Failed to save route ${route.origin} → ${route.destination}:`, error);
      // Continue with next route even if one fails
    }
  }
  
  return savedRoutes;
};

/**
 * Converts an API route to a database route
 */
const apiRouteToDbRoute = (apiRoute: Omit<ApiRouteType, 'id'>): Omit<DbRoute, 'id' | 'created_at' | 'updated_at'> => {
  // Use the first price point as the base price
  const basePrice = apiRoute.prices.length > 0 ? Math.min(...apiRoute.prices.map(p => p.price)) : 0;
  
  return {
    origin: apiRoute.from,
    destination: apiRoute.to,
    price: basePrice,
    departure_date: apiRoute.prices.length > 0 ? new Date(apiRoute.prices[0].date) : null,
    return_date: null, // Default to null for one-way flights
    airline: 'Multiple', // Default value, can be updated with actual airline data
    flight_number: null
  };
};

/**
 * Saves API routes to the database
 */
export const saveApiRoutes = async (apiRoutes: Omit<ApiRouteType, 'id'>[]): Promise<DbRoute[]> => {
  const dbRoutes = apiRoutes.map(apiRouteToDbRoute);
  return saveRoutes(dbRoutes);
};

/**
 * Checks if any routes exist in the database
 */
export const hasRoutes = async (): Promise<boolean> => {
  const result = await executeQuery<{ exists: boolean }>(
    'SELECT EXISTS(SELECT 1 FROM routes LIMIT 1) as "exists"'
  );
  return result.rows[0].exists;
};
