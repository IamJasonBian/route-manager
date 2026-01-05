/**
 * Deployment configuration for Route Manager environments.
 *
 * This file defines the environment configurations for deploying to different
 * Netlify sites. To deploy to a different environment, modify the deployment-config.json
 * file in the root of the repository.
 */

export type Environment = 'alpha' | 'gamma' | 'prod';

export interface EnvironmentConfig {
  name: Environment;
  siteId: string;
  url: string;
  description: string;
  isProtected: boolean;
}

/**
 * Environment configurations for Route Manager.
 * Each environment has its own Netlify site.
 */
export const environments: Record<Environment, EnvironmentConfig> = {
  alpha: {
    name: 'alpha',
    siteId: 'b26b3133-30c1-46f3-b976-59ab7c928b57',
    url: 'https://route-manager-alpha.netlify.app',
    description: 'Alpha environment for early testing and development',
    isProtected: false,
  },
  gamma: {
    name: 'gamma',
    siteId: '${NETLIFY_SITE_ID_GAMMA}', // Use GitHub secret
    url: 'https://route-manager-gamma.netlify.app',
    description: 'Gamma (staging) environment for pre-production testing',
    isProtected: false,
  },
  prod: {
    name: 'prod',
    siteId: '${NETLIFY_SITE_ID_PROD}', // Use GitHub secret
    url: 'https://route-manager-prod.netlify.app',
    description: 'Production environment',
    isProtected: true,
  },
};

/**
 * Default environment for deployments.
 * This is used when no specific environment is specified.
 */
export const defaultEnvironment: Environment = 'alpha';

/**
 * Gets the configuration for an environment.
 */
export function getEnvironmentConfig(env: Environment): EnvironmentConfig {
  const config = environments[env];
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  return config;
}

/**
 * Validates that an environment string is valid.
 */
export function isValidEnvironment(env: string): env is Environment {
  return ['alpha', 'gamma', 'prod'].includes(env);
}
