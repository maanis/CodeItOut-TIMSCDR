# Quick Verification Script

Run this to verify your logs system is working:

## Backend Checklist

```bash
# 1. Check if log file exists
cd backend
ls -la logs/app.log

# 2. Check log file has content
head -1 logs/app.log
# Should show JSON starting with {"level"

# 3. Check latest logs
tail -5 logs/app.log

# 4. Make a test API call
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/logs?page=1&limit=10

# Should return: {"logs":[...],"pagination":{...}}
```

## Frontend Checklist

```javascript
// Open browser console and run:

// 1. Check token has role
const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
console.log("User role:", decoded.role); // Should be 'admin'

// 2. Check API base URL
console.log(
  "API URL:",
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
);

// 3. Make direct API call
fetch("http://localhost:5000/api/logs?page=1&limit=5", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((data) => console.log("Logs:", data.logs.length, "logs received"))
  .catch((e) => console.error("Error:", e.message));
```

## Expected Behavior

✅ When you click around the admin panel:

- Each click generates a log entry
- Visible in `backend/logs/app.log`
- Displayed in `/admin/logs` page

✅ Statistics should show:

- Total Requests: > 0
- Success Rate: > 80%
- Response Times: < 100ms

✅ Logs table should display:

- Timestamps
- HTTP Methods (GET, POST, PUT, DELETE)
- URLs
- Status codes (color-coded)
- Response times

## If Nothing Shows

1. **Backend side:**

   - Confirm `npm run dev` is running
   - Check terminal for errors
   - Verify `backend/logs/app.log` is being written

2. **Frontend side:**

   - Open browser DevTools → Console
   - Look for errors
   - Check Network tab for 401/403 responses
   - Verify token has `role: 'admin'`

3. **File permissions:**

   ```bash
   chmod 644 backend/logs/app.log
   chmod 755 backend/logs
   ```

4. **Clear cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear localStorage: Open console, run `localStorage.clear()`
   - Log out and log back in
