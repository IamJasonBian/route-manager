# Deployment Quick Reference

This is a quick reference guide for common deployment scenarios. For detailed procedures, see [PROD_DEPLOYMENT_SOP.md](PROD_DEPLOYMENT_SOP.md).

## Common Scenarios

### 1. Testing Changes in a Pull Request

**What happens automatically:**
- Preview deployment is created with unique URL
- URL is posted as PR comment
- Preview is automatically cleaned up when PR is closed

**Steps:**
1. Create or update a Pull Request
2. Wait for GitHub Actions to complete (~3-5 minutes)
3. Check PR comments for preview URL
4. Test your changes at the preview URL

**Preview URL Format:**
```
https://[unique-id]--route-manager-gamma.netlify.app/
```

---

### 2. Deploying to Gamma (Staging)

**What happens automatically:**
- Triggers when code is merged to `main` branch
- Builds and deploys to gamma production URL

**Steps:**
1. Merge PR to `main` branch
2. Wait for GitHub Actions to complete (~3-5 minutes)
3. Verify at: https://route-manager-gamma.netlify.app/

**Manual Gamma Deployment:**
1. Go to: Actions → Deploy to Netlify
2. Click "Run workflow"
3. Environment: `gamma`
4. Dry-run: `false`
5. Click "Run workflow"

---

### 3. Validating Production Deployment (Dry-Run)

**When to use:**
- Before deploying to production
- Testing build process
- Validating changes without affecting live site

**Steps:**
1. Go to: Actions → Deploy to Netlify
2. Click "Run workflow"
3. Branch: `main`
4. Environment: `prod`
5. Dry-run: `true` ✓
6. Click "Run workflow"
7. Review workflow logs for build validation

**What gets tested:**
- ✅ Dependencies install correctly
- ✅ TypeScript compilation succeeds
- ✅ Build artifacts are generated
- ✅ Functions are bundled correctly
- ❌ No actual deployment occurs

---

### 4. Deploying to Production

**Prerequisites:**
- [ ] All tests passing in Gamma
- [ ] Changes tested and verified
- [ ] Dry-run completed successfully
- [ ] Stakeholders notified

**Steps:**
1. Go to: Actions → Deploy to Netlify
2. Click "Run workflow"
3. Branch: `main`
4. Environment: `prod`
5. Dry-run: `false`
6. Click "Run workflow"
7. **Approve deployment** if environment protection is configured
8. Wait for deployment to complete (~3-5 minutes)
9. Verify at: https://route-manager-prod.netlify.app/

**Post-Deployment Verification:**
- [ ] Homepage loads correctly
- [ ] Flight search works
- [ ] Price trends page displays data
- [ ] No console errors
- [ ] API endpoints respond

---

### 5. Emergency Rollback

**Fastest Method (via Netlify Dashboard):**
1. Log in to Netlify
2. Go to Production site
3. Click "Deploys" tab
4. Find last known good deployment
5. Click "Publish deploy"
6. Verify rollback successful

⏱️ **Rollback time: ~30 seconds**

**Alternative (via GitHub Actions):**
1. Identify stable commit hash
2. Create rollback branch from that commit
3. Run manual deployment to prod from rollback branch
4. Verify rollback successful
5. Create PR to merge fix to main

---

## Deployment Workflows at a Glance

| Trigger | Environment | URL | Automatic? | Approval Required? |
|---------|-------------|-----|------------|-------------------|
| PR created/updated | Preview | `https://[id]--route-manager-gamma.netlify.app/` | ✅ Yes | ❌ No |
| Push to `main` | Gamma | `https://route-manager-gamma.netlify.app/` | ✅ Yes | ❌ No |
| Manual dispatch (gamma) | Gamma | `https://route-manager-gamma.netlify.app/` | ❌ No | ❌ No |
| Manual dispatch (prod) | Production | `https://route-manager-prod.netlify.app/` | ❌ No | ⚠️ Optional* |

*If GitHub environment protection is configured

---

## Workflow Parameters

### workflow_dispatch Inputs

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| `environment` | choice | `gamma`, `prod` | `gamma` | Target deployment environment |
| `dry_run` | boolean | `true`, `false` | `false` | Build without deploying |

---

## Quick Status Checks

### Check Deployment Status
```bash
# Check GitHub Actions
# Go to: https://github.com/IamJasonBian/route-manager/actions

# Check Netlify Status
# Go to: https://app.netlify.com
```

### Test Deployed Functions
```bash
# Gamma
curl https://route-manager-gamma.netlify.app/.netlify/functions/health

# Production
curl https://route-manager-prod.netlify.app/.netlify/functions/health
```

### Check Environment Variables
```bash
# Gamma
curl https://route-manager-gamma.netlify.app/.netlify/functions/test-env

# Production
curl https://route-manager-prod.netlify.app/.netlify/functions/test-env
```

---

## Common Issues & Quick Fixes

### Build Fails
**Symptom:** Red X on GitHub Actions workflow

**Quick Fix:**
1. Check workflow logs for error
2. Verify dependencies in `package.json`
3. Test build locally: `npm ci && npm run build`

### Preview URL Not Posted
**Symptom:** PR has no preview URL comment

**Quick Fix:**
1. Check workflow logs for deployment step
2. Verify `NETLIFY_SITE_ID_GAMMA` secret is set
3. Check Netlify dashboard for deploy

### Function Returns Errors
**Symptom:** API endpoints return 500 errors

**Quick Fix:**
1. Check Netlify function logs
2. Verify environment variables in Netlify dashboard
3. Check that `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`, `AMADEUS_HOSTNAME` are set

### CORS Errors
**Symptom:** Browser console shows CORS policy errors

**Quick Fix:**
1. Check function CORS headers
2. Verify origin is in `allowedOrigins` list
3. Update CORS configuration and redeploy

---

## Support Resources

- **Full Documentation**: [PROD_DEPLOYMENT_SOP.md](PROD_DEPLOYMENT_SOP.md)
- **Repository**: https://github.com/IamJasonBian/route-manager
- **Issues**: https://github.com/IamJasonBian/route-manager/issues
- **Netlify Dashboard**: https://app.netlify.com
- **GitHub Actions**: https://github.com/IamJasonBian/route-manager/actions

---

*Last Updated: 2025-12-27*
