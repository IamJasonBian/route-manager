import { Pool } from 'pg';
import { ApiRoute } from '../src/services/api';
import { defaultRoutes } from '../src/config/defaultRoutes';

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'routeuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'routedb',
  password: process.env.DB_PASSWORD || 'routepass',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Helper function to check if routes exist in the database
async function hasRoutes(): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT EXISTS(SELECT 1 FROM routes LIMIT 1) as "exists"');
    return result.rows[0].exists;
  } finally {
    client.release();
  }
}

// Helper function to save routes to the database
async function saveApiRoutes(routes: Omit<ApiRoute, 'id'>[]): Promise<ApiRoute[]> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const savedRoutes: ApiRoute[] = [];
    
    for (const route of routes) {
      const { from, to, basePrice, prices, distance, duration, meta } = route;
      
      // Insert the route
      const routeResult = await client.query(
        `INSERT INTO routes (from_location, to_location, base_price, distance, duration, meta)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, from_location as "from", to_location as "to", base_price as "basePrice", 
                  distance, duration, meta`,
        [from, to, basePrice, distance, duration, meta]
      );
      
      const savedRoute = routeResult.rows[0];
      
      // Insert price history if available
      if (prices && prices.length > 0) {
        const priceValues = prices.map(price => 
          `('${savedRoute.id}', '${price.date}', ${price.price})`
        ).join(',');
        
        await client.query(
          `INSERT INTO price_history (route_id, date, price)
           VALUES ${priceValues}`
        );
      }
      
      savedRoutes.push({
        ...savedRoute,
        prices: prices || []
      });
    }
    
    await client.query('COMMIT');
    return savedRoutes;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving routes:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Script to load default routes into the database
 */
async function loadDefaultRoutes() {
  try {
    console.log('Checking for existing routes...');
    
    // Check if we already have routes in the database
    const routesExist = await hasRoutes();
    
    if (routesExist) {
      console.log('Routes already exist in the database. Skipping...');
      return;
    }
    
    console.log('Loading default routes into the database...');
    
    // Save the default routes to the database
    const savedRoutes = await saveApiRoutes(defaultRoutes);
    
    console.log(`Successfully loaded ${savedRoutes.length} routes into the database.`);
    console.log('You can now start the application to see the routes.');
  } catch (error) {
    console.error('Error loading default routes:', error);
    process.exit(1);
  }
}

// Run the script
loadDefaultRoutes();
