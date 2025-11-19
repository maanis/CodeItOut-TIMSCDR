# Logs Monitoring System - Complete Setup & Troubleshooting

## ✅ What's Been Implemented

### Backend Components

1. **Pino Logger Configuration** (`src/config/logger.js`)
   - Logs to BOTH console and file
   - File location: `logs/app.log`
   - JSON format for machine parsing
   - Automatic HTTP request/response logging

2. **Logs Controller** (`src/controllers/logsController.js`)
   - `GET /api/logs` - Fetch logs with pagination & filtering
   - `GET /api/logs/stats` - Get log statistics

3. **Logs Routes** (`src/routes/logsRoutes.js`)
   - Protected routes (admin/teacher only)
   - Authentication required

4. **Main App** (`src/index.js`)
   - Pino HTTP middleware registered
   - Logs routes mounted at `/api/logs`

### Frontend Components

1. **Logs Page** (`src/pages/admin/Logs.jsx`)
   - Statistics dashboard
   - Advanced filtering
   - Pagination
   - Search functionality
   - Color-coded status badges

2. **Admin Sidebar** - Added "Logs" navigation item

3. **App Routing** - Added `/admin/logs` route

---

## 🔍 Troubleshooting: "No Logs Showing"

### Check 1: Verify Log File Exists
```bash
ls -la backend/logs/
# Should show: app.log
```

### Check 2: Verify Logs Are Being Written
```bash
tail -f backend/logs/app.log
# You should see JSON entries when making API calls
```

### Check 3: Test the API Directly
```bash
# Get your admin token first, then:
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/logs?page=1&limit=50

# Should return JSON with logs array
```

### Check 4: Verify User Role
The logs API requires `req.user.role` to be either `'admin'` or `'teacher'`. 

**Check your JWT token contains role:**
```javascript
// In browser console:
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log(decoded); // Should show { id, email, role: 'admin' }
```

---

## 🛠️ Common Issues & Fixes

### Issue 1: Empty Logs Array
**Cause:** No API requests have been made since server startup

**Solution:** 
- Make some API calls (e.g., click around the admin panel)
- Logs only show recent requests

### Issue 2: HTTP 403 "Access denied"
**Cause:** User is not admin/teacher, or role not in JWT

**Solution:**
```javascript
// Check token decode in browser:
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('Role:', decoded.role); // Should be 'admin' or 'teacher'
```

### Issue 3: HTTP 401 "Invalid token"
**Cause:** Token expired or missing

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Login again
- Get new token

### Issue 4: API returning empty response
**Cause:** Log file not readable or parsing error

**Solution:**
1. Check file permissions:
   ```bash
   chmod 644 backend/logs/app.log
   ```

2. Check log file format:
   ```bash
   head -1 backend/logs/app.log
   # Should start with: {"level":30,...}
   ```

### Issue 5: Logs page loads but shows "No logs found"
**Possible Causes:**
1. Filters are too restrictive
2. Logs haven't been created yet
3. Role filter not working

**Solution:**
1. Click "Apply Filters" with all defaults (no filters)
2. Make sure to make an API call first to generate logs
3. Check browser console for detailed errors

---

## 📊 How to Generate Test Logs

1. **In Admin Panel**, click through various pages:
   - Dashboard
   - Students
   - Projects
   - Events
   - Etc.

2. Each page load generates logs

3. Then click "Logs" tab to see them

4. Or make direct API call:
   ```bash
   curl http://localhost:5000/api/students \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 🔍 Manual Testing Steps

### Step 1: Start Backend
```bash
cd backend
npm run dev
```

### Step 2: Check Logs File
```bash
tail -f logs/app.log
# Should see entries like:
# {"level":30,"time":...,"msg":"Server running on port 5000"}
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 4: Login as Admin
- Username: admin@email.com (or admin email)
- Password: your_password

### Step 5: Make API Calls
- Click around admin panel to generate logs
- Each click = API request = log entry

### Step 6: Go to Logs Tab
- Admin Panel → Logs
- Should see your API calls listed

### Step 7: Test Filters
- Status Filter: Try "Success", "Client Error", "Server Error"
- Level Filter: Try different log levels
- Search: Type a URL or error message

---

## 📝 Log File Location

- **Development**: `backend/logs/app.log`
- **File Format**: JSON Lines (one JSON object per line)
- **Each entry contains**: method, url, statusCode, responseTime, timestamp

### Sample Log Entry:
```json
{
  "level": 30,
  "time": 1763570717076,
  "pid": 340,
  "hostname": "Computer-Name",
  "req": {
    "method": "GET",
    "url": "/api/logs?page=1&limit=50",
    "path": "/api/logs",
    "headers": {
      "host": "localhost:5000",
      "user-agent": "Mozilla/5.0..."
    },
    "remoteAddress": "127.0.0.1"
  },
  "res": {
    "statusCode": 200,
    "responseTime": 31
  },
  "msg": "GET /api/logs?page=1&limit=50 200"
}
```

---

## 🚀 Performance Tips

1. **Don't request huge log sets**
   - Default: 50 logs per page
   - Max: 100 logs per page
   - Use filters to narrow results

2. **Use search & filters**
   - Search by URL to find specific endpoints
   - Filter by status to find errors quickly

3. **Refresh sparingly**
   - Don't auto-refresh every second
   - Manual refresh is fine

4. **Archive old logs**
   - Consider moving old logs to separate file
   - Keeps app.log size manageable

---

## 📚 API Reference

### GET /api/logs
Fetch logs with pagination and filtering

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 50, max: 100) - Logs per page
- `level` - Filter: debug, info, warn, error, fatal
- `statusCode` - Filter: 200 (2xx), 400 (4xx), 500 (5xx)
- `search` - Search in URL, method, message
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)

**Response:**
```json
{
  "logs": [
    {
      "id": "string",
      "timestamp": "2025-11-19T10:30:45.123Z",
      "level": "info|warn|error|fatal",
      "method": "GET|POST|PUT|DELETE",
      "url": "/api/endpoint",
      "statusCode": 200,
      "responseTime": 45,
      "message": "string",
      "error": "string|null"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "pages": 25
  }
}
```

### GET /api/logs/stats
Get log statistics

**Response:**
```json
{
  "totalLogs": 1250,
  "successCount": 1100,
  "clientErrorCount": 120,
  "serverErrorCount": 30,
  "avgResponseTime": 45.23,
  "levelCounts": {
    "info": 1100,
    "warn": 120,
    "error": 30
  }
}
```

---

## 🔒 Security Notes

- ✅ Logs API requires authentication
- ✅ Only admins/teachers can view logs
- ✅ Role is verified server-side
- ⚠️ Don't expose sensitive data in logs
- ⚠️ Consider GDPR when logging user data

---

## 📞 Getting Help

If logs still aren't showing:

1. **Check backend logs in terminal**
   - Look for error messages
   - Check if httpLogger is being called

2. **Check browser console**
   - Errors often show here
   - Network tab shows API response

3. **Verify file permissions**
   - `ls -la backend/logs/app.log`
   - File should be readable

4. **Verify JSON format**
   - First line of app.log should be valid JSON
   - Not plain text

---

## ✅ Verification Checklist

- [ ] `backend/logs/app.log` file exists
- [ ] File has JSON content (not empty)
- [ ] Backend is running (`npm run dev`)
- [ ] Frontend can access admin panel
- [ ] User is logged in as admin
- [ ] Token contains `role: 'admin'`
- [ ] Made at least one API call
- [ ] No 403 or 401 errors in browser console
- [ ] `/api/logs` endpoint returns 200
- [ ] Logs page displays some entries

If all checkboxes pass, logs should be working! 🎉
