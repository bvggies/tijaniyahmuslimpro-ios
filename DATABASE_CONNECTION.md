# 🔗 Database Connection Guide

## Quick Setup

Both the **Mobile App** and **Web App** are already configured to use the **same database** through a shared backend API.

### Current Configuration

- **Backend API**: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
- **Database**: PostgreSQL (shared by both apps)
- **Status**: ✅ Already configured

## Web App Setup

1. **Create `.env` file** in the web app root directory:
   ```bash
   cd C:\Users\Administrator\Desktop\tijaniyah-muslim-pro-web
   ```

2. **Add this line** to `.env`:
   ```env
   REACT_APP_API_URL=https://tijaniyahmuslimproappreact-production-1e25.up.railway.app
   ```

3. **Restart the development server**:
   ```bash
   npm start
   ```

## Mobile App Setup

The mobile app is already configured. The API URL is set in:
- `src/services/api.ts` (default fallback)
- `app.config.js` (environment variable override)

## Verify Connection

### Test Web App:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Login or register
4. Verify requests go to: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`

### Test Mobile App:
1. Check console logs
2. Verify API requests use the correct URL

## What This Means

✅ **Same User Accounts** - Login works on both apps  
✅ **Synchronized Data** - Posts, comments, journals sync automatically  
✅ **No Data Loss** - All data stored in shared database  
✅ **Cross-Platform** - Use mobile or web, data is always in sync  

## Troubleshooting

**Web app can't connect?**
- Check `.env` file exists and has `REACT_APP_API_URL`
- Restart dev server after creating `.env`
- Check browser console for errors

**Mobile app can't connect?**
- Check network connectivity
- Verify API URL in console logs
- Check backend is running

**Data not syncing?**
- Verify both apps use same API URL
- Check you're logged in with same account
- Verify backend is accessible

For detailed information, see `SHARED_DATABASE_SETUP.md`.

