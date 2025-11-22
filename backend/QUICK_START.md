# Quick Setup Guide - Enhanced Authentication System

## What Was Implemented

### ✅ Completed Components

1. **Email Templates** (React Email)

   - `src/emails/OTPEmail.jsx` - OTP display for verification
   - `src/emails/ResetPasswordEmail.jsx` - Password reset link
   - `src/emails/WelcomeEmail.jsx` - Welcome message

2. **Email Service** (`src/config/emailService.js`)

   - Nodemailer for development (Ethereal)
   - Resend integration ready for production
   - Functions: sendOTPEmail, sendPasswordResetEmail, sendWelcomeEmail

3. **Rate Limiting Middleware** (`src/middleware/rateLimiter.js`)

   - Redis-based counters
   - Per-endpoint rate limits
   - Returns 429 when exceeded

4. **Auth Controller Updates** (`src/controllers/authController.js`)

   - sendOTP - Generate and send OTP
   - verifyOTP - Verify OTP code
   - registerStudent - Register with email verification
   - loginStudent - Password-based login
   - loginSendOTP - Passwordless login (send OTP)
   - loginVerifyOTP - Passwordless login (verify OTP)
   - forgotPassword - Send password reset link
   - resetPassword - Reset password with token

5. **Auth Routes Updates** (`src/routes/authRoutes.js`)

   - All 8 new endpoints with rate limiting
   - Clean JSON response format
   - Proper HTTP status codes

6. **Student Model Update** (`src/models/Student.js`)
   - Added: isEmailVerified, emailVerifiedAt
   - Made password nullable (for passwordless)
   - Made roll optional

## Installation

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Update Environment (.env)

The `.env` file has been updated with email configuration. For development, it's pre-configured with Ethereal (test email service).

Current settings:

```env
FRONTEND_URL=http://localhost:5173
EMAIL_FROM=noreply@codeitout.dev
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=test@ethereal.email
SMTP_PASSWORD=test_password
```

### Step 3: Start Backend

```bash
npm run dev
```

Server will start on http://localhost:5000

## Testing the API

### Scenario 1: Registration Flow

1. **Send OTP**

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected: 200 OK with "OTP sent to your email"

2. **Verify OTP** (use OTP from Ethereal email preview)

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

Expected: 200 OK

3. **Register**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"test@example.com",
    "password":"SecurePass123",
    "roll":"CS001"
  }'
```

Expected: 201 Created with token

### Scenario 2: Password-Based Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"SecurePass123"
  }'
```

Expected: 200 OK with token

### Scenario 3: Passwordless Login

1. **Send OTP**

```bash
curl -X POST http://localhost:5000/api/auth/login-send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

2. **Verify OTP and Login**

```bash
curl -X POST http://localhost:5000/api/auth/login-verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

Expected: 200 OK with token

### Scenario 4: Forgot & Reset Password

1. **Request Reset**

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected: 200 OK (check email for reset link)

2. **Reset Password** (extract token from email link)

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"token_from_email",
    "password":"NewSecurePass456"
  }'
```

Expected: 200 OK

## Rate Limiting Test

Try sending multiple requests to `/send-otp` within 5 minutes:

```bash
# 1st-3rd requests: Success (200)
# 4th request onwards: Rate limit exceeded (429)
# Response:
{
  "success": false,
  "message": "Too many attempts. Please try again in 245 seconds.",
  "retryAfter": 245
}
```

## Email Verification in Development

### Ethereal Email Service

When testing with Ethereal:

1. Emails are **not sent** to actual inbox
2. Instead, check the **Response Preview URL** in logs
3. Click the URL to view the email in browser

### To Use Real Email (Ethereal Account)

1. Go to https://ethereal.email
2. Click "Create Ethereal Account"
3. Copy credentials from account page
4. Update `.env`:
   ```env
   SMTP_USER=your_ethereal_email@ethereal.email
   SMTP_PASSWORD=your_ethereal_password
   ```

### Production (Resend)

1. Sign up at https://resend.com
2. Get API key
3. Update `.env`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   NODE_ENV=production
   ```
4. Email service will automatically switch to Resend

## Database Changes

Run MongoDB directly or via your client:

```javascript
// Existing students get default values
db.students.updateMany(
  {},
  {
    $set: {
      isEmailVerified: false,
      emailVerifiedAt: null,
    },
  }
);
```

Note: The application automatically adds these fields to new students.

## Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Descriptive success message",
  "token": "jwt_token_if_applicable",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "isEmailVerified": true
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### Rate Limit Response

```json
{
  "success": false,
  "message": "Too many attempts. Please try again in {seconds} seconds.",
  "retryAfter": {seconds}
}
```

## Logs

All operations are logged to:

- **Console**: Pretty-printed with `pino-pretty`
- **File**: `logs/app.log` (JSON format)

View sample logs:

```bash
tail -f logs/app.log | npx pino-pretty
```

## Troubleshooting

### Issue: "Email service not initialized"

- Ensure `initializeEmailService()` is called in `index.js` ✅ (Already done)

### Issue: "OTP not received"

- Check Ethereal email preview in logs
- Verify email address in request
- OTP expires after 5 minutes

### Issue: "Rate limit immediately exceeded"

- Redis may still have old counters
- Clear Redis: `redis-cli FLUSHDB`
- Or wait for counters to expire

### Issue: "Invalid or expired reset token"

- Reset token expires after 30 minutes
- Request new password reset
- Check token format in email link

## Next Steps

### Frontend Integration (if needed)

1. Create auth forms for OTP and password flows
2. Store JWT token in localStorage/cookies
3. Use token in Authorization header

### Email Customization

1. Edit template files in `src/emails/`
2. Modify styling in CSS objects
3. Add custom variables as needed

### Additional Features

1. Add email confirmation resend
2. Implement social login
3. Add multi-factor authentication
4. Implement session management

## API Summary

| Method | Endpoint                  | Rate Limit | Purpose            |
| ------ | ------------------------- | ---------- | ------------------ |
| POST   | /api/auth/send-otp        | 3/5min     | Send OTP           |
| POST   | /api/auth/verify-otp      | 5/5min     | Verify OTP         |
| POST   | /api/auth/register        | 10/1hr     | Register           |
| POST   | /api/auth/login           | 5/15min    | Password login     |
| POST   | /api/auth/login-send-otp  | 3/5min     | Send OTP for login |
| POST   | /api/auth/login-verify    | 5/5min     | OTP login          |
| POST   | /api/auth/forgot-password | 3/30min    | Request reset      |
| POST   | /api/auth/reset-password  | —          | Reset password     |
| POST   | /api/auth/logout          | —          | Logout             |
| GET    | /api/auth/isAuthenticated | —          | Check auth         |

## Files Created/Updated

### Created:

- ✅ `src/emails/OTPEmail.jsx`
- ✅ `src/emails/ResetPasswordEmail.jsx`
- ✅ `src/emails/WelcomeEmail.jsx`
- ✅ `src/config/emailService.js`
- ✅ `src/middleware/rateLimiter.js`
- ✅ `AUTH_SYSTEM_README.md` (detailed documentation)

### Updated:

- ✅ `src/controllers/authController.js` (complete rewrite)
- ✅ `src/routes/authRoutes.js`
- ✅ `src/models/Student.js`
- ✅ `src/index.js` (added email service init)
- ✅ `package.json` (added dependencies)
- ✅ `.env` (added email config)

## Support & Documentation

For detailed API documentation, see: `AUTH_SYSTEM_README.md`

All endpoints return consistent JSON format with `success` field and descriptive messages.
