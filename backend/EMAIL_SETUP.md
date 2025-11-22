# Email Service Setup Guide

## Problem: "OTP Sent Successfully" but No Email Received

The backend shows success because it successfully connects to Ethereal, but **test credentials don't actually send real emails**. You need to:

1. Generate valid Ethereal credentials
2. Update .env
3. Restart backend

---

## Solution: Quick Setup (2 minutes)

### Step 1: Generate Ethereal Credentials

Run this command in the backend directory:

```bash
cd backend
node create-ethereal-account.js
```

You'll see output like:

```
🔧 Creating Ethereal Test Email Account...

✅ Test account created successfully!

📧 Email Credentials:

==================================================
SMTP_USER=john.doe123@ethereal.email
SMTP_PASSWORD=abc123xyz789pwd
==================================================

📋 Add these to your .env file:

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=john.doe123@ethereal.email
SMTP_PASSWORD=abc123xyz789pwd
```

### Step 2: Update .env File

Edit `backend/.env` and update these lines:

```env
SMTP_USER=john.doe123@ethereal.email
SMTP_PASSWORD=abc123xyz789pwd
```

(Replace with your generated credentials)

### Step 3: Restart Backend

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

You'll see in the console:

```
✓ Email service initialized successfully
```

---

## Now Test It

### Send OTP:

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Console Output:

Look for this in your server logs:

```
✓ OTP email sent to test@example.com
📧 Preview URL: https://ethereal.email/message/xxxxx
```

### View Email:

**Click the Preview URL** shown in logs OR go to:

https://ethereal.email/messages

You'll see all sent emails with the OTP code.

---

## How Ethereal Works

**Ethereal Email:**

- Free test email service
- No real emails sent
- All emails viewable in web interface
- Perfect for development
- Each session creates new test mailbox

**Preview URL:**

- Shows in console logs after each send
- Contains the full email with HTML rendering
- OTP visible in email body
- Copy-paste to test registration flow

---

## Troubleshooting

### Issue: "Email service not initialized"

```
Solution: Check SMTP_USER and SMTP_PASSWORD are not empty in .env
```

### Issue: "Authentication failed"

```
Solution: Credentials expired (they expire after 3 months)
Run: node create-ethereal-account.js again
```

### Issue: No preview URL in logs

```
Solution: Check NODE_ENV=development in .env
```

### Issue: "Connect ECONNREFUSED"

```
Solution: Ethereal host might be blocked (rare)
Try again, or use different credentials
```

---

## For Production (Later)

When deploying to production:

1. Sign up at https://resend.com
2. Get API key
3. Update `.env.production`:
   ```env
   NODE_ENV=production
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Backend will automatically switch to Resend

---

## Email Credentials Security

**For Development:**

- Ethereal credentials are temporary
- Safe to commit to git (it's a test account)
- New account generated each session

**For Production:**

- NEVER commit real API keys to git
- Use environment variables on hosting
- Use services like AWS Secrets Manager

---

## Files Modified

1. `src/config/emailService.js` - Better error handling & logging
2. `.env` - Cleared test credentials
3. `create-ethereal-account.js` - New helper script

---

## Quick Command Reference

```bash
# Generate credentials
node create-ethereal-account.js

# Start backend
npm run dev

# Send test OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# View emails
# Check console for preview URL
# Or visit: https://ethereal.email/messages
```

---

## Testing Registration Flow

Once emails are working:

1. **Frontend → Send OTP**

   - Enters email in Register form
   - Clicks "Continue to Verification"
   - Check console for preview URL
   - Copy OTP from email

2. **Frontend → Verify OTP**

   - Enters 6-digit OTP
   - Proceeds to confirmation stage
   - Database marked email as verified

3. **Frontend → Complete Registration**
   - Uploads profile image
   - Creates account
   - Redirected to dashboard

---

## Still Not Working?

Check these:

1. **SMTP_USER and SMTP_PASSWORD not empty?**

   ```bash
   grep SMTP_USER backend/.env
   grep SMTP_PASSWORD backend/.env
   ```

2. **Server restarted after .env change?**

   ```bash
   # Stop: Ctrl+C
   # Start: npm run dev
   ```

3. **Redis running?**

   ```bash
   redis-cli ping
   # Should return: PONG
   ```

4. **MongoDB running?**
   ```bash
   mongosh
   # Should connect without error
   ```

If issues persist, check logs:

```bash
# View latest logs
tail -f logs/app.log
```

---

## Next Steps

After email working:

1. ✅ Test registration with real email
2. ✅ Test login with OTP
3. ✅ Test forgot password flow
4. 🔄 Test all 3 authentication tabs in Login page
5. 📧 Update production email config when deploying
