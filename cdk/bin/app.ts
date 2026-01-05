#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as fs from 'fs';
import * as path from 'path';
import { NetlifyDeployStack } from '../lib/netlify-deploy-stack';
import { Environment, isValidEnvironment, defaultEnvironment } from '../lib/config';

const app = new cdk.App();

// Read deployment configuration
const configPath = path.join(__dirname, '../../deployment-config.json');
let deploymentConfig: { targetEnvironment: Environment } = { targetEnvironment: defaultEnvironment };

if (fs.existsSync(configPath)) {
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(configContent);
    if (parsed.targetEnvironment && isValidEnvironment(parsed.targetEnvironment)) {
      deploymentConfig.targetEnvironment = parsed.targetEnvironment;
    } else {
      console.warn(`Invalid target environment in config, using default: ${defaultEnvironment}`);
    }
  } catch (error) {
    console.warn(`Error reading deployment config, using default: ${defaultEnvironment}`);
  }
} else {
  console.log(`No deployment config found at ${configPath}, using default: ${defaultEnvironment}`);
}

// Allow environment variable override
const envOverride = process.env.TARGET_ENVIRONMENT;
if (envOverride && isValidEnvironment(envOverride)) {
  deploymentConfig.targetEnvironment = envOverride;
  console.log(`Using environment override from TARGET_ENVIRONMENT: ${envOverride}`);
}

console.log(`Deploying to environment: ${deploymentConfig.targetEnvironment}`);

// Create the stack
new NetlifyDeployStack(app, `RouteManager-${deploymentConfig.targetEnvironment}-Stack`, {
  targetEnvironment: deploymentConfig.targetEnvironment,
  githubOwner: 'IamJasonBian',
  githubRepo: 'route-manager',
  githubBranch: 'main',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: `Route Manager deployment pipeline for ${deploymentConfig.targetEnvironment} environment`,
});

app.synth();
