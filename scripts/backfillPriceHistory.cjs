const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '../../.env') });

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'routeuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'routedb',
  password: process.env.DB_PASSWORD || 'routepass',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool({
  ...dbConfig,
  max: 10, // Increase max connections for bulk operations
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Batch size for bulk inserts
const BATCH_SIZE = 100;

/**
 * Generate price history for a route
 * @param {Object} route - The route object
 * @param {Date} endDate - The end date for the history
 * @param {number} days - Number of days of history to generate
 * @returns {Array} Array of price history entries
 */
function generatePriceHistory(route, endDate = new Date(), days = 30) {
  const history = [];
  const basePrice = parseFloat(route.price);
  
  if (isNaN(basePrice)) return history;
  
  // Add some randomness to the price history
  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));
    
    // Add some realistic price fluctuations
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    const price = Math.round(basePrice * randomFactor * 100) / 100;
    
    history.push({
      route_id: route.id,
      price,
      recorded_at: date
    });
  }
  
  return history;
}

/**
 * Insert price history in bulk
 * @param {Object} client - Database client
 * @param {Array} entries - Array of price history entries
 */
async function bulkInsertPriceHistory(client, entries) {
  if (entries.length === 0) return;
  
  // Create a query with parameterized values
  const values = [];
  const valueStrings = [];
  let paramCount = 1;
  
  for (const entry of entries) {
    values.push(
      entry.route_id,
      entry.price,
      entry.recorded_at
    );
    
    valueStrings.push(
      `($${paramCount++}, $${paramCount++}, $${paramCount++})`
    );
  }
  
  const query = `
    INSERT INTO price_history (route_id, price, recorded_at)
    VALUES ${valueStrings.join(', ')}
    ON CONFLICT (route_id, recorded_at) DO NOTHING
  `;
  
  await client.query(query, values);
}

async function backfillPriceHistory() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Starting price history backfill...');
    
    // Get all routes with prices and departure dates
    const { rows: routes } = await client.query(`
      SELECT * FROM routes 
      WHERE price IS NOT NULL 
      AND departure_date IS NOT NULL
    `);
    
    console.log(`Found ${routes.length} valid routes to process`);
    
    // Process routes in batches
    for (let i = 0; i < routes.length; i += BATCH_SIZE) {
      const batch = routes.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(routes.length / BATCH_SIZE)}`);
      
      const priceHistoryEntries = [];
      
      // Generate price history for each route in the batch
      for (const route of batch) {
        console.log(`  - Processing route ${route.id}: ${route.origin} to ${route.destination}`);
        
        // Skip if we already have history for this route
        const { rowCount } = await client.query(
          'SELECT 1 FROM price_history WHERE route_id = $1 LIMIT 1',
          [route.id]
        );
        
        if (rowCount > 0) {
          console.log(`    ✓ Skipping route ${route.id} - already has price history`);
          continue;
        }
        
        // Generate price history for this route
        const endDate = route.updated_at || route.created_at || new Date();
        const history = generatePriceHistory(route, endDate, 30);
        priceHistoryEntries.push(...history);
      }
      
      // Insert all entries for this batch
      if (priceHistoryEntries.length > 0) {
        console.log(`  - Inserting ${priceHistoryEntries.length} price history entries`);
        await bulkInsertPriceHistory(client, priceHistoryEntries);
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Price history backfill completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

backfillPriceHistory().catch(console.error);
