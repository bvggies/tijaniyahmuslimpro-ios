# ✅ Database Connection Verification

Use this guide to verify that both apps are connected to the same database.

## Quick Verification Steps

### 1. Check Web App Connection

1. Open the web app in your browser
2. Open DevTools (F12) → Network tab
3. Try to login or register
4. Look for requests to: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
5. ✅ If you see requests to this URL, web app is connected!

### 2. Check Mobile App Connection

1. Open the mobile app
2. Check console logs (React Native Debugger or Metro bundler)
3. Look for API requests in the logs
4. Verify requests go to: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
5. ✅ If you see requests to this URL, mobile app is connected!

### 3. Test Data Synchronization

**Test 1: Create Account on Web**
1. Create a new account on the web app
2. Note the email and password
3. Try to login with the same credentials on mobile app
4. ✅ If login works, accounts are shared!

**Test 2: Create Post on Mobile**
1. Login on mobile app
2. Create a community post
3. Open web app and login with same account
4. ✅ If you see the post, data is synchronized!

**Test 3: Create Journal Entry on Web**
1. Login on web app
2. Create a journal entry
3. Open mobile app and login
4. ✅ If you see the journal entry, data is synchronized!

## API Health Check

Test if the backend API is accessible:

```bash
# Using curl
curl https://tijaniyahmuslimproappreact-production-1e25.up.railway.app/health

# Expected response:
# {"status":"ok"}
```

Or open in browser:
```
https://tijaniyahmuslimproappreact-production-1e25.up.railway.app/health
```

## Common Issues

### ❌ Web app shows "Network Error"

**Solution:**
- Check `.env` file exists with `REACT_APP_API_URL`
- Restart dev server: `npm start`
- Check browser console for CORS errors
- Verify backend is running

### ❌ Mobile app can't connect

**Solution:**
- Check network connectivity
- Verify API URL in `app.config.js`
- Check Metro bundler logs
- Ensure backend CORS allows mobile origin

### ❌ Data not syncing

**Solution:**
- Verify both apps use same API URL
- Check you're logged in with same account
- Verify backend is accessible
- Check backend logs for errors

## Success Indicators

✅ **Web app**: Network requests go to Railway backend  
✅ **Mobile app**: Console logs show Railway backend URL  
✅ **Accounts**: Same login works on both apps  
✅ **Data**: Posts/journals created on one app appear on the other  
✅ **Health**: `/health` endpoint returns `{"status":"ok"}`  

If all checks pass, both apps are successfully connected to the same database! 🎉

