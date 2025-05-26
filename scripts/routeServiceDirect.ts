import { executeQuery, getClient } from './dbDirect';

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

/**
 * Retrieves all routes from the database
 * @param origin Optional origin filter
 * @param destination Optional destination filter
 * @returns Array of routes
 */
export async function getRoutes(origin?: string, destination?: string): Promise<DbRoute[]> {
  try {
    let query = 'SELECT * FROM routes';
    const params: any[] = [];
    
    // Add filters if provided
    const conditions: string[] = [];
    if (origin) {
      conditions.push('origin = $1');
      params.push(origin);
    }
    if (destination) {
      conditions.push(`destination = $${params.length + 1}`);
      params.push(destination);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    console.log('Executing database query:', query);
    console.log('Query parameters:', params);
    
    const result = await executeQuery<DbRoute>(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error in getRoutes:', error);
    throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Checks if any routes exist in the database
 * @returns Boolean indicating if routes exist
 */
export async function hasRoutes(): Promise<boolean> {
  try {
    const result = await executeQuery('SELECT 1 FROM routes LIMIT 1');
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error checking for routes:', error);
    return false;
  }
}

/**
 * Saves a route to the database
 * @param route The route data to save (without id, created_at, and updated_at)
 * @returns The saved route with all fields
 */
export async function saveRoute(
  route: Omit<DbRoute, 'id' | 'created_at' | 'updated_at'>
): Promise<DbRoute> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO routes (
        origin, destination, price, departure_date, return_date, airline, flight_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const params = [
      route.origin,
      route.destination,
      route.price,
      route.departure_date,
      route.return_date,
      route.airline,
      route.flight_number
    ];
    
    const result = await client.query<DbRoute>(query, params);
    await client.query('COMMIT');
    
    if (result.rows.length === 0) {
      throw new Error('Failed to save route: No rows returned');
    }
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving route:', error);
    throw new Error(`Failed to save route: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}
