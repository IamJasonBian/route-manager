import { saveApiRoutes, hasRoutes } from '../src/services/routeService';
import { defaultRoutes } from '../src/config/defaultRoutes';

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
