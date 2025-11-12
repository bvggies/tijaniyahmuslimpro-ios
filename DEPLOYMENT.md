# Deployment Guide for Vercel

This guide will help you deploy the Tijaniyah Muslim Pro Web App to Vercel.

## Prerequisites

- GitHub account with the repository: `https://github.com/bvggies/tijaniyahmuslimpro-ios`
- Vercel account (sign up at https://vercel.com)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import the repository: `bvggies/tijaniyahmuslimpro-ios`
4. Vercel will automatically detect it's a Create React App project

### 2. Configure Build Settings

Vercel should auto-detect these settings from `vercel.json`:

- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. Environment Variables

Add the following environment variable in Vercel:

- **Name**: `REACT_APP_API_URL`
- **Value**: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`

To add environment variables:
1. Go to Project Settings → Environment Variables
2. Add the variable for Production, Preview, and Development environments
3. Redeploy after adding variables

### 4. Deploy

1. Click "Deploy" button
2. Vercel will build and deploy your app
3. You'll get a deployment URL (e.g., `https://tijaniyah-muslim-pro-web.vercel.app`)

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Build Configuration

The project uses `vercel.json` for configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://tijaniyahmuslimproappreact-production-1e25.up.railway.app"
  }
}
```

## Important Notes

1. **SPA Routing**: The `rewrites` configuration ensures React Router works correctly on Vercel
2. **Environment Variables**: Make sure to set `REACT_APP_API_URL` in Vercel dashboard
3. **Build Output**: The build folder is automatically generated and deployed
4. **Auto Deployments**: Vercel will automatically deploy on every push to the `main` branch

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### 404 Errors on Routes
- Ensure `vercel.json` has the rewrites configuration
- Verify React Router is properly configured

### API Connection Issues
- Verify `REACT_APP_API_URL` environment variable is set
- Check CORS settings on your backend API
- Ensure the API endpoint is accessible

## Post-Deployment

After successful deployment:

1. Test all routes and features
2. Verify API connections
3. Test on mobile devices
4. Check PWA functionality (service worker)
5. Monitor Vercel analytics

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Review build logs in Vercel dashboard
- Check GitHub repository for issues

