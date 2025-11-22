# Enhanced Authentication System Documentation

## Overview

Complete email-based authentication system with OTP verification, passwordless login, forgot password functionality, and rate limiting using Redis.

## Features

- ✅ Email OTP verification (5-min TTL)
- ✅ Email-password registration
- ✅ Traditional password-based login
- ✅ Passwordless login with OTP
- ✅ Forgot password with reset link
- ✅ Password reset functionality
- ✅ Rate limiting on all endpoints (Redis-based)
- ✅ React Email templates (OTPEmail, ResetPasswordEmail, WelcomeEmail)
- ✅ Resend integration ready for production
- ✅ Pino logging for all operations

## API Endpoints

### 1. Email Verification & Registration

#### Send OTP

```
POST /api/auth/send-otp
Content-Type: application/json
Rate Limit: 3 attempts per 5 minutes

Request:
{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to your email",
  "email": "user@example.com"
}

Errors:
- 400: Email is required
- 400: Email already registered and verified
- 429: Too many requests (rate limit exceeded)
```

#### Verify OTP

```
POST /api/auth/verify-otp
Content-Type: application/json
Rate Limit: 5 attempts per 5 minutes

Request:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully",
  "email": "user@example.com"
}

Errors:
- 400: Email and OTP are required
- 400: OTP expired or invalid
- 400: Invalid OTP
- 429: Too many requests
```

#### Register Student

```
POST /api/auth/register
Content-Type: application/json
Rate Limit: 10 attempts per hour per IP

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "roll": "CS001" (optional)
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}

Errors:
- 400: Name, email, and password are required
- 400: Email not verified
- 400: Email already registered
- 429: Too many registration attempts
```

### 2. Login - Password-Based

#### Login Student

```
POST /api/auth/login
Content-Type: application/json
Rate Limit: 5 attempts per 15 minutes

Request:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}

Errors:
- 400: Email and password are required
- 401: Invalid credentials
- 403: Email not verified
- 429: Too many login attempts
```

### 3. Login - Passwordless (OTP-Based)

#### Send OTP for Login

```
POST /api/auth/login-send-otp
Content-Type: application/json
Rate Limit: 3 attempts per 5 minutes

Request:
{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to your email",
  "email": "john@example.com"
}

Errors:
- 400: Email is required
- 404: Student not found or email not verified
- 429: Too many requests
```

#### Verify OTP and Login

```
POST /api/auth/login-verify
Content-Type: application/json
Rate Limit: 5 attempts per 5 minutes

Request:
{
  "email": "john@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}

Errors:
- 400: Email and OTP are required
- 400: OTP expired
- 400: Invalid OTP
- 404: Student not found
- 429: Too many attempts
```

### 4. Forgot Password & Reset

#### Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json
Rate Limit: 3 attempts per 30 minutes

Request:
{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset link sent to your email"
}

Note: Response is always 200 for security (doesn't reveal if email exists)
```

#### Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json

Request:
{
  "token": "reset_token_from_email_link",
  "password": "NewSecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successful"
}

Errors:
- 400: Token and password are required
- 400: Invalid or expired reset token
- 404: Student not found
```

### 5. Authentication State

#### Logout

```
POST /api/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

#### Check Authentication

```
GET /api/auth/isAuthenticated
Authorization: Bearer {token}

Response (200):
{
  "authenticated": true,
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isEmailVerified": true
  }
}

Or:
{
  "authenticated": false
}
```

## Rate Limiting

All endpoints use Redis-based rate limiting:

| Endpoint         | Limit       | Window          |
| ---------------- | ----------- | --------------- |
| /send-otp        | 3 attempts  | 5 minutes       |
| /verify-otp      | 5 attempts  | 5 minutes       |
| /register        | 10 attempts | 1 hour (per IP) |
| /login           | 5 attempts  | 15 minutes      |
| /login-send-otp  | 3 attempts  | 5 minutes       |
| /login-verify    | 5 attempts  | 5 minutes       |
| /forgot-password | 3 attempts  | 30 minutes      |

Rate limit exceeded returns:

```json
{
  "success": false,
  "message": "Too many attempts. Please try again in {ttl} seconds.",
  "retryAfter": {ttl}
}
Status: 429 Too Many Requests
```

## Email Templates

### OTPEmail.jsx

Sends 6-digit OTP for email verification or passwordless login.

```jsx
<OTPEmail otp="123456" userName="John Doe" expiryMinutes={5} />
```

### ResetPasswordEmail.jsx

Sends password reset link with expiry information.

```jsx
<ResetPasswordEmail
  resetLink="https://app.com/reset-password?token=..."
  userName="John Doe"
  expiryMinutes={30}
/>
```

### WelcomeEmail.jsx

Sends welcome message after successful registration.

```jsx
<WelcomeEmail userName="John Doe" email="john@example.com" />
```

## Redis Keys

| Key Pattern                        | TTL    | Purpose                                     |
| ---------------------------------- | ------ | ------------------------------------------- |
| `otp:{email}`                      | 5 min  | Stores OTP for email verification           |
| `email:verified:{email}`           | 1 hour | Marks email as verified during registration |
| `login:otp:{email}`                | 5 min  | Stores OTP for passwordless login           |
| `password:reset:{hashedToken}`     | 30 min | Stores email for password reset             |
| `ratelimit:login:{email}`          | 15 min | Login rate limit counter                    |
| `ratelimit:otp:request:{email}`    | 5 min  | OTP request rate limit counter              |
| `ratelimit:otp:verify:{email}`     | 5 min  | OTP verification rate limit counter         |
| `ratelimit:password:reset:{email}` | 30 min | Password reset request rate limit counter   |
| `ratelimit:register:{ip}`          | 1 hour | Registration rate limit counter             |

## Database Schema Updates

### Student Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (nullable, for passwordless),
  roll: String (optional),
  avatarUrl: String,
  isEmailVerified: Boolean (default: false),
  emailVerifiedAt: Date,
  badges: [ObjectId],
  approvedProjects: [ObjectId],
  inCommunity: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

```env
# Email Configuration
FRONTEND_URL=http://localhost:5173
EMAIL_FROM=noreply@codeitout.dev

# Development (Ethereal)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=test@ethereal.email
SMTP_PASSWORD=test_password

# Production (Resend)
RESEND_API_KEY=your_resend_api_key
NODE_ENV=production
```

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

Status codes:

- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized (invalid credentials)
- 403: Forbidden (email not verified)
- 404: Not found
- 429: Too many requests (rate limit)
- 500: Server error

## Security Features

1. **Password Security**: Uses bcryptjs with salt rounds (10)
2. **Token Security**: JWT with 7-day expiry
3. **OTP Security**: 6-digit random, 5-minute expiry
4. **Rate Limiting**: Redis-based counters prevent brute force
5. **Email Verification**: Required before login
6. **Reset Token**: Hashed and stored in Redis
7. **HTTPS Ready**: Secure cookie settings in production

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file with email settings (see Environment Variables above)

### 3. For Development

Email will be sent via Ethereal (test service):

- Emails are captured and displayed in browser
- Check https://ethereal.email for test account

### 4. For Production

1. Set up Resend account: https://resend.com
2. Add `RESEND_API_KEY` to `.env`
3. Update `NODE_ENV=production`

## Testing with cURL

### Send OTP

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"user@example.com",
    "password":"SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'
```

### Passwordless Login - Send OTP

```bash
curl -X POST http://localhost:5000/api/auth/login-send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Passwordless Login - Verify

```bash
curl -X POST http://localhost:5000/api/auth/login-verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

### Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Reset Password

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"reset_token_here","password":"NewPassword123"}'
```

## Logging

All authentication operations are logged using Pino:

- OTP sent/verified
- Registration/login attempts
- Password reset requests
- Rate limit violations
- Email service errors

View logs in:

- Console (with `pino-pretty` in development)
- File: `logs/app.log` (JSON format)

## Notes

1. **Email OTP expires** after 5 minutes
2. **Reset tokens expire** after 30 minutes
3. **Email verification** valid for 1 hour after OTP verification
4. **Passwords are hashed** with bcryptjs (10 rounds)
5. **JWTs expire** after 7 days
6. **Rate limits** are per email/IP and prevent brute force attacks
