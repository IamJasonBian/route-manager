import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Load environment variables from .env file in the project root
 * This works from any subdirectory
 */
function loadEnv() {
  // Start from the current directory and go up until we find package.json
  let currentDir = process.cwd();
  const rootDir = path.parse(currentDir).root; // Get the root directory of the filesystem
  
  while (currentDir !== rootDir) {
    const envPath = path.join(currentDir, '.env');
    const packageJsonPath = path.join(currentDir, 'package.json');
    
    // If we find package.json, we're in the project root
    if (fs.existsSync(packageJsonPath) && fs.existsSync(envPath)) {
      console.log(`Loading environment variables from: ${envPath}`);
      const result = dotenv.config({ path: envPath });
      
      if (result.error) {
        console.error('Error loading .env file:', result.error);
      } else {
        console.log('Successfully loaded environment variables');
      }
      
      return result;
    }
    
    // Move up one directory
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // We've reached the root directory
      break;
    }
    currentDir = parentDir;
  }
  
  console.error('Could not find .env file in project root');
  return { error: new Error('Could not find .env file in project root') };
}

export { loadEnv };
