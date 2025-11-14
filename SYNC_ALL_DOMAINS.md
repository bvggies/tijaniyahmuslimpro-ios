# How to Sync All 3 Vercel Domains - Step by Step Guide

## ⚠️ IMPORTANT: This Must Be Done in Vercel Dashboard

The production domain (`tijaniyahmuslimpro-ios.vercel.app`) does NOT automatically update. You MUST manually promote deployments or enable auto-deployment.

## Quick Fix: Manual Promotion (Takes 2 Minutes)

### Step 1: Open Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Sign in if needed
3. Click on your project: **`tijaniyahmuslimpro-ios`**

### Step 2: Find Latest Deployment
1. Click **"Deployments"** in the left sidebar
2. Look at the top of the list - the LATEST deployment should be at the top
3. Check the commit message - it should say:
   - "Remove invalid git property from vercel.json" (commit: `e743325`)
   - OR "Update Vercel config and deployment guide" (commit: `0d8a83a`)
   - OR "Fix blank page issue" (commit: `9600777`)

### Step 3: Promote to Production
1. Find the **LATEST** deployment (top of the list)
2. Look for three dots (⋯) on the right side of that deployment row
3. Click the three dots (⋯)
4. Click **"Promote to Production"** from the dropdown menu
5. Wait 2-3 minutes for it to complete

### Step 4: Verify All Domains
After 2-3 minutes, check all 3 domains:

1. **Main Production Domain:**
   - Visit: `https://tijaniyahmuslimpro-ios.vercel.app`
   - Should show: Splash screen → GuestModeScreen (welcome page)
   - Press F12 → Console → Type: `document.querySelector('meta[name="build-version"]')?.content`
   - Should show: `2024-12-19-v2`

2. **Preview Domain 1:**
   - Visit: `https://tijaniyahmuslimpro-ios-git-main-samuels-projects-1cfda609.vercel.app`
   - Should show same content as main domain

3. **Preview Domain 2:**
   - Visit: `https://tijaniyahmuslimpro-ios-778z08m7t-samuels-projects-1cfda609.vercel.app`
   - Should show same content as main domain

## Permanent Fix: Enable Auto-Deployment (One-Time Setup)

This will make ALL future deployments automatically update the production domain.

### Step 1: Go to Settings
1. In Vercel dashboard, click **"Settings"** (left sidebar)
2. Click **"Git"** section

### Step 2: Configure Production Branch
1. Find **"Production Branch"** setting
2. Make sure it's set to: **`main`**
3. If not, change it to `main` and save

### Step 3: Enable Auto-Deployments
1. Still in **"Git"** settings
2. Find **"Automatic deployments from Git"**
3. Make sure it's **ENABLED** for the `main` branch
4. If not, enable it

### Step 4: Enable Auto-Production Deployments
1. Click **"Deployments"** section (still in Settings)
2. Find **"Automatic Production Deployments"**
3. Enable this option
4. This makes every push to `main` automatically update production domain

### Step 5: Save and Verify
1. All settings should now be saved
2. Future pushes to `main` will automatically:
   - Create a new deployment
   - Update production domain automatically
   - All preview domains will also get the latest code

## Troubleshooting

### If "Promote to Production" is Grayed Out
- The deployment might already be in production
- Check if the deployment shows "Production" badge
- If it does, it's already the active production deployment

### If Production Domain Still Shows Old Version
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private window
3. Wait 5 minutes for CDN propagation
4. Check deployment status in Vercel dashboard

### If You See Multiple Deployments
- Always promote the **LATEST** one (top of the list)
- Check the commit hash to confirm it's the latest
- Latest commit should be: `e743325`

## Current Status

- ✅ Latest code pushed: Commit `e743325`
- ✅ Build version: `2024-12-19-v2`
- ⏳ **ACTION REQUIRED**: Promote latest deployment to production in Vercel dashboard

## After Promotion

Once you promote the latest deployment:
- ✅ All 3 domains will show the same version
- ✅ Splash screen will appear
- ✅ GuestModeScreen will show as starting page (no blank page)
- ✅ All latest features will be available

---

**Note**: Preview domains (`-git-main-*` and `-*`) automatically get the latest code. Only the production domain (`tijaniyahmuslimpro-ios.vercel.app`) needs manual promotion unless auto-deployment is enabled.

