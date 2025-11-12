# 🔗 Shared Database Setup Guide

This guide explains how both the **Mobile App** and **Web App** connect to the same database, ensuring data synchronization and no data loss.

## 📊 Current Setup

Both apps are already configured to use the **same backend API** and **same database**:

- **Backend API URL**: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
- **Database**: PostgreSQL (hosted on Railway)
- **ORM**: Prisma
- **Backend Framework**: NestJS

## ✅ How It Works

### Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Mobile App    │         │    Web App      │
│  (React Native) │         │   (React Web)   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │  HTTP/HTTPS Requests      │
         │  (REST API)               │
         │                           │
         └───────────┬───────────────┘
                     │
         ┌───────────▼───────────┐
         │   Backend API (NestJS) │
         │   Railway Deployment   │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   PostgreSQL Database  │
         │   (Shared by both apps)│
         └───────────────────────┘
```

### Data Flow

1. **Mobile App** makes API calls → Backend API → PostgreSQL Database
2. **Web App** makes API calls → Backend API → PostgreSQL Database
3. Both apps read/write to the **same database**, so data is always synchronized

## 🔧 Configuration

### Mobile App Configuration

The mobile app is configured in `src/services/api.ts`:

```typescript
export const API_URL: string =
  ((Constants.expoConfig?.extra as any)?.API_URL as string) ||
  'https://tijaniyahmuslimproappreact-production-1e25.up.railway.app';
```

**Environment Variable** (optional, for different environments):
- Set `API_URL` in `app.config.js` or `app.json` under `extra.API_URL`

### Web App Configuration

The web app is configured in `src/services/api.ts`:

```typescript
export const API_URL: string =
  process.env.REACT_APP_API_URL ||
  'https://tijaniyahmuslimproappreact-production-1e25.up.railway.app';
```

**Environment Variable**:
- Create `.env` file in the web app root
- Set `REACT_APP_API_URL=https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`

## 🚀 Setup Instructions

### Step 1: Verify Backend is Running

1. Check if the backend API is accessible:
   ```bash
   curl https://tijaniyahmuslimproappreact-production-1e25.up.railway.app/health
   ```

2. You should get a response like:
   ```json
   {"status":"ok"}
   ```

### Step 2: Configure Web App Environment

1. Create `.env` file in the web app root directory:
   ```bash
   cd C:\Users\Administrator\Desktop\tijaniyah-muslim-pro-web
   ```

2. Create `.env` file:
   ```env
   REACT_APP_API_URL=https://tijaniyahmuslimproappreact-production-1e25.up.railway.app
   ```

3. Restart the development server:
   ```bash
   npm start
   ```

### Step 3: Configure Mobile App (Optional)

If you need to use a different API URL for development:

1. Edit `app.config.js` or `app.json`:
   ```javascript
   export default {
     extra: {
       API_URL: process.env.API_URL || 'https://tijaniyahmuslimproappreact-production-1e25.up.railway.app'
     }
   }
   ```

2. Or set environment variable:
   ```bash
   export API_URL=https://tijaniyahmuslimproappreact-production-1e25.up.railway.app
   ```

### Step 4: Verify Connection

#### Test from Web App:
1. Open the web app in browser
2. Open browser DevTools (F12)
3. Go to Network tab
4. Try to login or register
5. Check that requests go to: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`

#### Test from Mobile App:
1. Open the mobile app
2. Check console logs for API requests
3. Verify requests go to the correct URL

## 📱 Data Synchronization

### What Data is Shared?

All data stored in the database is shared between both apps:

- ✅ **User Accounts** - Same login works on both apps
- ✅ **Authentication Tokens** - JWT tokens work across platforms
- ✅ **Community Posts** - Posts visible on both apps
- ✅ **Comments & Likes** - All interactions synchronized
- ✅ **Journal Entries** - Personal journals accessible from both apps
- ✅ **Chat Messages** - Conversations sync across platforms
- ✅ **User Profiles** - Profile data shared

### Example Scenario

1. User creates account on **Mobile App** → Saved to database
2. User logs in on **Web App** with same credentials → ✅ Works!
3. User creates a post on **Web App** → Saved to database
4. User opens **Mobile App** → ✅ Post is visible!
5. User likes a post on **Mobile App** → Saved to database
6. User checks **Web App** → ✅ Like count updated!

## 🔐 Authentication

Both apps use the same authentication system:

- **JWT Tokens** - Tokens issued by backend work on both apps
- **Token Storage**:
  - Mobile: `AsyncStorage` (device storage)
  - Web: `localStorage` (browser storage)
- **Token Format**: Same JWT format, validated by same backend

### Important Notes:

- Tokens are **platform-specific** (stored separately on mobile vs web)
- But the **same account** can be logged in on both platforms simultaneously
- Logging out on one platform does **not** log out the other

## 🗄️ Database Schema

The shared database includes:

- **User** - User accounts and profiles
- **CommunityPost** - Community posts
- **CommunityComment** - Post comments
- **CommunityLike** - Post likes
- **JournalEntry** - Personal journal entries
- **Conversation** - Chat conversations
- **Message** - Chat messages

See `api/prisma/schema.prisma` for full schema details.

## 🛠️ Backend Configuration

The backend is configured in the `api` folder:

### Environment Variables (Backend)

The backend needs these environment variables (set in Railway dashboard):

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

### Database Connection

The backend uses Prisma to connect to PostgreSQL:

```typescript
// api/src/prisma/prisma.service.ts
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔍 Troubleshooting

### Issue: Web app can't connect to API

**Solution:**
1. Check `.env` file exists and has correct `REACT_APP_API_URL`
2. Restart development server after changing `.env`
3. Check browser console for CORS errors
4. Verify backend is running and accessible

### Issue: Mobile app can't connect to API

**Solution:**
1. Check `app.config.js` or `app.json` for API_URL
2. Verify network connectivity
3. Check console logs for API errors
4. Ensure backend CORS allows mobile app origin

### Issue: Data not syncing between apps

**Solution:**
1. Verify both apps point to same API URL
2. Check that you're logged in with same account
3. Verify backend is running and database is accessible
4. Check browser/device console for API errors

### Issue: Authentication not working

**Solution:**
1. Clear app storage (localStorage/AsyncStorage)
2. Try logging in again
3. Check backend logs for authentication errors
4. Verify JWT_SECRET is set correctly in backend

## 📝 Best Practices

1. **Always use environment variables** for API URLs
2. **Never hardcode** API URLs in code
3. **Test both apps** after backend changes
4. **Monitor backend logs** for errors
5. **Use same API version** for both apps
6. **Keep backend updated** with latest migrations

## 🚀 Deployment

### Backend Deployment (Railway)

The backend is already deployed on Railway. To update:

1. Push changes to repository
2. Railway automatically rebuilds and deploys
3. Database migrations run automatically

### Web App Deployment

When deploying the web app:

1. Set `REACT_APP_API_URL` in deployment environment variables
2. Build the app: `npm run build`
3. Deploy to Vercel/Netlify/etc.

### Mobile App Deployment

When building the mobile app:

1. Set `API_URL` in `app.config.js` or environment
2. Build APK/IPA: `eas build` or `expo build`
3. API URL is bundled in the app

## ✅ Verification Checklist

- [ ] Backend API is accessible and responding
- [ ] Web app `.env` file has correct `REACT_APP_API_URL`
- [ ] Mobile app has correct API URL in config
- [ ] Can create account on web app
- [ ] Can login with same account on mobile app
- [ ] Data created on web app appears on mobile app
- [ ] Data created on mobile app appears on web app
- [ ] Authentication tokens work on both platforms

## 📞 Support

If you encounter issues:

1. Check backend logs on Railway dashboard
2. Check browser console (web app)
3. Check device logs (mobile app)
4. Verify database connection in Railway
5. Test API endpoints directly with curl/Postman

---

**Last Updated**: 2025-01-27
**Backend URL**: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
**Database**: PostgreSQL (Railway)

