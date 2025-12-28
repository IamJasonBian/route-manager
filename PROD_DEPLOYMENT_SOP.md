# Production Deployment Standard Operating Procedure (SOP)

## Overview

This document outlines the standard operating procedure for deploying the Route Manager application to production. The deployment process includes three environments:
- **Preview**: Unique preview deployments for Pull Requests
- **Gamma**: Staging environment (route-manager-gamma.netlify.app)
- **Prod**: Production environment (route-manager-prod.netlify.app)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Types](#deployment-types)
3. [Automated Deployments](#automated-deployments)
4. [Manual Deployments](#manual-deployments)
5. [Dry-Run Deployments](#dry-run-deployments)
6. [Production Deployment Checklist](#production-deployment-checklist)
7. [Rollback Procedure](#rollback-procedure)
8. [Troubleshooting](#troubleshooting)
9. [Environment Configuration](#environment-configuration)

---

## Prerequisites

### Required Access
- GitHub repository write access
- Netlify account access (for manual deployments)
- GitHub Actions workflow execution permissions

### Required Secrets (GitHub Repository Settings)
Navigate to: **Settings → Secrets and variables → Actions**

| Secret Name | Description | Used By |
|------------|-------------|---------|
| `NETLIFY_AUTH_TOKEN` | Netlify API authentication token | All deployments |
| `NETLIFY_SITE_ID_GAMMA` | Gamma environment site ID | Gamma/Preview deployments |
| `NETLIFY_SITE_ID_PROD` | Production environment site ID | Prod deployments |

### Required Environment Variables (Netlify Dashboard)
Navigate to: **Site Settings → Environment Variables** (for each site)

| Variable Name | Description | Value |
|--------------|-------------|-------|
| `AMADEUS_API_KEY` | Amadeus API key | Your API key |
| `AMADEUS_API_SECRET` | Amadeus API secret | Your API secret |
| `AMADEUS_HOSTNAME` | Amadeus environment | `production` or `test` |

---

## Deployment Types

### 1. Preview Deployments (Pull Requests)
**Trigger**: Automatically when a Pull Request is opened or updated

**Characteristics**:
- Generates unique preview URL (e.g., `https://682abc123--route-manager-gamma.netlify.app/`)
- Uses Gamma site configuration
- Automatically deleted when PR is closed/merged
- Posts preview URL as PR comment

**Use Case**: Testing changes before merging to main

### 2. Gamma Deployments (Staging)
**Trigger**: Automatically on push to `main` or `master` branch

**Characteristics**:
- Deploys to: `https://route-manager-gamma.netlify.app`
- Production deployment to Gamma site (`--prod` flag)
- Used for staging/integration testing

**Use Case**: Continuous deployment of merged changes

### 3. Production Deployments
**Trigger**: Manual via GitHub Actions workflow dispatch

**Characteristics**:
- Deploys to: `https://route-manager-prod.netlify.app`
- Requires manual approval via GitHub Environment protection
- Supports dry-run mode for validation

**Use Case**: Controlled releases to production

---

## Automated Deployments

### Pull Request Preview Deployment

**Process**:
1. Developer creates/updates a Pull Request
2. GitHub Actions automatically triggers `deploy-preview` job
3. Application is built and deployed to Gamma site (preview mode)
4. Unique preview URL is generated and posted as PR comment
5. Automated tests run against preview deployment

**Preview URL Format**:
```
https://{deploy-id}--route-manager-gamma.netlify.app/
```

**Validation**:
- Check PR comments for preview URL
- Visit preview URL and test functionality
- Review automated test results in workflow logs

### Gamma (Staging) Deployment

**Process**:
1. Code is merged to `main` branch
2. GitHub Actions automatically triggers `deploy-gamma` job
3. Application is built and deployed to Gamma production
4. Automated tests run against Gamma deployment

**Gamma URL**:
```
https://route-manager-gamma.netlify.app
```

**Validation**:
- Monitor GitHub Actions workflow completion
- Visit Gamma URL and verify deployment
- Check Netlify dashboard for deployment status

---

## Manual Deployments

### Starting a Manual Deployment

1. Navigate to GitHub Actions tab
2. Select "Deploy to Netlify" workflow
3. Click "Run workflow" button
4. Configure deployment options:
   - **Use workflow from**: Select branch (usually `main`)
   - **Deployment environment**: Choose `gamma` or `prod`
   - **Dry-run**: Select `true` for validation, `false` for actual deployment

### Manual Gamma Deployment

**When to Use**:
- Need to redeploy Gamma without pushing new code
- Testing deployment process
- Recovering from failed automated deployment

**Steps**:
1. Run workflow with:
   - Environment: `gamma`
   - Dry-run: `false`
2. Monitor workflow execution
3. Verify deployment at `https://route-manager-gamma.netlify.app`

### Manual Production Deployment

**When to Use**:
- Promoting stable Gamma changes to Production
- Scheduled production releases
- Emergency hotfix deployments

**Steps**:
1. Run workflow with:
   - Environment: `prod`
   - Dry-run: `false`
2. **Environment Protection**: Approve deployment if required
3. Monitor workflow execution
4. Verify deployment at `https://route-manager-prod.netlify.app`

---

## Dry-Run Deployments

### What is a Dry-Run?

A dry-run performs all build steps and validations without actually deploying to Netlify. This allows you to:
- Validate build process
- Check for build errors
- Review build artifacts
- Test deployment workflow without affecting live sites

### Running a Dry-Run

1. Navigate to GitHub Actions → Deploy to Netlify
2. Click "Run workflow"
3. Configure:
   - **Use workflow from**: `main`
   - **Deployment environment**: `prod` (or `gamma`)
   - **Dry-run**: `true` ✓
4. Click "Run workflow"

### Dry-Run Output

The workflow will:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ List build artifacts
5. ❌ Skip Netlify deployment
6. ✅ Display success message

**Expected Output**:
```
🏃 DRY-RUN MODE ENABLED
Environment: prod
This is a dry-run. No deployment will be performed.
Build will be tested but not deployed.
...
✅ Dry-run completed successfully!
Build validation passed. Ready for actual deployment.
```

### After a Successful Dry-Run

If the dry-run succeeds, you can proceed with actual deployment:
1. Run the workflow again
2. Use same environment selection
3. Set **Dry-run**: `false`
4. Approve environment protection if required

---

## Production Deployment Checklist

### Pre-Deployment

- [ ] All tests passing in Gamma environment
- [ ] Code reviewed and approved
- [ ] Changes tested in Preview/Gamma environments
- [ ] Breaking changes documented
- [ ] Database migrations completed (if applicable)
- [ ] Environment variables verified in Netlify dashboard
- [ ] Stakeholders notified of deployment window

### Dry-Run Validation

- [ ] Run dry-run deployment for production
- [ ] Verify build completes successfully
- [ ] Review build artifacts and function list
- [ ] Confirm no build errors or warnings
- [ ] Check that all required assets are generated

### Production Deployment

- [ ] Trigger production deployment workflow
- [ ] Approve environment protection (if required)
- [ ] Monitor deployment progress in GitHub Actions
- [ ] Wait for deployment to complete (typically 2-5 minutes)
- [ ] Verify deployment status in Netlify dashboard

### Post-Deployment Verification

- [ ] Visit `https://route-manager-prod.netlify.app`
- [ ] Verify homepage loads correctly
- [ ] Test flight search functionality
- [ ] Check price trends page
- [ ] Verify API endpoints respond correctly:
  - `/test-env` - Environment check
  - `/search-flights` - Flight search
  - `/popular-routes` - Popular routes
  - `/airport-search` - Airport autocomplete
- [ ] Check browser console for errors
- [ ] Verify no CORS errors
- [ ] Monitor Netlify function logs for errors

### Rollback Criteria

If any of the following occur, initiate rollback:
- [ ] Application fails to load
- [ ] Critical functionality broken
- [ ] API endpoints returning errors
- [ ] CORS errors blocking functionality
- [ ] Database connectivity issues
- [ ] Performance degradation >50%

---

## Rollback Procedure

### Quick Rollback via Netlify Dashboard

**Fastest method** (recommended for emergencies):

1. Log in to Netlify dashboard
2. Navigate to Production site
3. Go to **Deploys** tab
4. Find last known good deployment
5. Click "Publish deploy" to restore

**Time to rollback**: ~30 seconds

### Rollback via GitHub Actions

1. Identify commit hash of last stable version
2. Create rollback branch:
   ```bash
   git checkout -b rollback-prod main
   git reset --hard {STABLE_COMMIT_HASH}
   git push origin rollback-prod -f
   ```
3. Run manual deployment workflow:
   - Branch: `rollback-prod`
   - Environment: `prod`
   - Dry-run: `false`
4. Approve deployment
5. After successful rollback, create PR to merge fix to main

**Time to rollback**: ~5-10 minutes

### Post-Rollback Actions

1. Notify stakeholders of rollback
2. Document rollback reason in incident log
3. Create bug report for issue that caused rollback
4. Plan fix and re-deployment
5. Update deployment notes

---

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Symptoms**:
- Workflow fails at "Build" step
- TypeScript compilation errors
- Missing dependencies

**Solutions**:
```bash
# Verify build works locally
npm ci
npm run build

# Check for TypeScript errors
npm run lint

# Update dependencies if needed
npm install
```

#### 2. Deployment Authentication Errors

**Symptoms**:
- "Authentication failed" error
- "Invalid token" message

**Solutions**:
- Verify `NETLIFY_AUTH_TOKEN` secret is set in GitHub
- Regenerate token in Netlify dashboard if expired
- Update secret in GitHub repository settings

#### 3. Environment Variable Issues

**Symptoms**:
- Functions return "API key not set" errors
- 500 errors from Netlify functions

**Solutions**:
- Check Netlify dashboard: Site Settings → Environment Variables
- Verify `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`, `AMADEUS_HOSTNAME` are set
- Trigger new deployment after adding variables

#### 4. CORS Errors

**Symptoms**:
- Browser console shows CORS policy errors
- API requests blocked

**Solutions**:
- Check function files for CORS headers
- Verify origin is in allowedOrigins list
- Update CORS configuration in affected functions

#### 5. Preview URL Not Generated

**Symptoms**:
- PR comment missing preview URL
- "deploy_url not found" error

**Solutions**:
- Check workflow logs for deployment output
- Verify `jq` command successfully parsed JSON
- Ensure Netlify CLI returned valid JSON response

#### 6. Function Timeout

**Symptoms**:
- Function execution exceeds 10 seconds
- "Function timeout" errors

**Solutions**:
- Optimize API calls (reduce number of requests)
- Implement caching where possible
- Consider upgrading Netlify plan for longer timeouts

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review Netlify function logs in dashboard
3. Check browser console for client-side errors
4. Review deployment summary in Netlify
5. Consult `DEPLOYMENT_SUMMARY.md` for additional context

---

## Environment Configuration

### Environment Protection Rules

#### Production Environment

**Protection Rules** (configured in GitHub):
1. Required reviewers: 1 approver minimum
2. Wait timer: None (optional: add 5-minute delay)
3. Allowed branches: `main`, `master`

**To Configure**:
1. Go to repository **Settings → Environments**
2. Click **prod** environment (or create it)
3. Add **Required reviewers**: Select team members
4. Enable **Required reviewers** protection rule

### Netlify Site Configuration

#### Gamma Site
- **Site name**: `route-manager-gamma`
- **URL**: `https://route-manager-gamma.netlify.app`
- **Build**: Disabled (handled by GitHub Actions)
- **Deploy previews**: Enabled for PRs

#### Production Site
- **Site name**: `route-manager-prod`
- **URL**: `https://route-manager-prod.netlify.app`
- **Build**: Disabled (handled by GitHub Actions)
- **Deploy previews**: Disabled

### Environment Variables Matrix

| Variable | Gamma | Prod | Preview | Notes |
|----------|-------|------|---------|-------|
| `AMADEUS_API_KEY` | ✓ | ✓ | ✓ | Set in Netlify |
| `AMADEUS_API_SECRET` | ✓ | ✓ | ✓ | Set in Netlify |
| `AMADEUS_HOSTNAME` | `test` | `production` | `test` | Set in Netlify |
| `NODE_ENV` | `production` | `production` | `production` | Auto-set |

---

## Deployment Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pull Request Created                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   deploy-preview     │
                  │   - Build            │
                  │   - Deploy preview   │
                  │   - Post PR comment  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Preview URL:        │
                  │  https://abc123--    │
                  │  route-manager-      │
                  │  gamma.netlify.app   │
                  └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Code Merged to Main                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   deploy-gamma       │
                  │   - Build            │
                  │   - Deploy to Gamma  │
                  │   - Run tests        │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Gamma Production:   │
                  │  https://route-      │
                  │  manager-gamma.      │
                  │  netlify.app         │
                  └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Manual Workflow Dispatch                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴───────────┐
                │                        │
                ▼                        ▼
     ┌──────────────────┐    ┌──────────────────┐
     │   Dry-run: true  │    │  Dry-run: false  │
     │   - Build        │    │  - Build         │
     │   - Validate     │    │  - Deploy        │
     │   - Stop         │    │  - Test          │
     └──────────────────┘    └────────┬─────────┘
                                      │
                         ┌────────────┴──────────┐
                         │                       │
                         ▼                       ▼
              ┌──────────────────┐   ┌──────────────────┐
              │  Environment:    │   │  Environment:    │
              │  gamma           │   │  prod            │
              │                  │   │                  │
              │  Deploy to       │   │  Deploy to       │
              │  Gamma           │   │  Production      │
              └──────────────────┘   └────────┬─────────┘
                                              │
                                              ▼
                                   ┌──────────────────┐
                                   │ Approval Required│
                                   │ (if configured)  │
                                   └────────┬─────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │  Prod Deployed:  │
                                   │  https://route-  │
                                   │  manager-prod.   │
                                   │  netlify.app     │
                                   └──────────────────┘
```

---

## Deployment History & Audit Log

### Tracking Deployments

All deployments are tracked in:
1. **GitHub Actions**: Workflow run history
2. **Netlify Dashboard**: Deploy history for each site
3. **Git History**: Commit SHAs linked to deployments

### Viewing Deployment History

**GitHub Actions**:
```
Repository → Actions → Deploy to Netlify → View runs
```

**Netlify Dashboard**:
```
Site → Deploys → View all deploys
```

**Git Log**:
```bash
git log --oneline --all
```

### Deployment Metadata

Each deployment includes:
- Commit SHA
- Deployer (GitHub user)
- Timestamp
- Environment (gamma/prod)
- Build duration
- Deployment status
- Deploy ID (Netlify)

---

## Best Practices

### Development Workflow

1. **Create feature branch** from `main`
2. **Open Pull Request** → Automatic preview deployment
3. **Test in preview environment**
4. **Get code review and approval**
5. **Merge to main** → Automatic Gamma deployment
6. **Test in Gamma environment**
7. **Manual deployment to Prod** after validation

### Deployment Timing

- **Gamma**: Continuous (automatic on merge)
- **Prod**: Scheduled releases (e.g., Tuesday/Thursday afternoons)
- **Hotfixes**: As needed (with dry-run validation)

### Communication

- Announce production deployments in team channel
- Document breaking changes in release notes
- Notify stakeholders of deployment windows
- Create post-deployment status updates

### Validation

- Always run dry-run for production deployments
- Test in Gamma before deploying to Prod
- Verify all critical paths after deployment
- Monitor error logs for 30 minutes post-deployment

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | System | Initial SOP creation |

---

## Contact & Support

- **Repository**: https://github.com/IamJasonBian/route-manager
- **Issues**: https://github.com/IamJasonBian/route-manager/issues
- **Deployments**: https://app.netlify.com

---

*Last Updated: 2025-12-27*
