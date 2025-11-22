# Complete Login Implementation Guide

## Overview

Comprehensive multi-tab authentication system with 3 different login methods:

1. **Username + Password** (Primary)
2. **Email + Password** (Secondary)
3. **Passwordless OTP Login** with password reset flow

---

## Backend Changes

### 1. Controller Updates (`authController.js`)

#### New Function: `loginWithUsername`

```javascript
POST / api / auth / login - username;
Body: {
  username, password;
}
Response: {
  success, message, token, user;
}
```

**Features:**

- Login via unique username (lowercase)
- Email verification required
- Returns JWT token and user data
- Same rate limiting as email login (5 attempts/15min)

**Error Handling:**

- 400: Missing fields
- 401: Invalid credentials
- 403: Email not verified (returns email for reference)
- 500: Server error

#### Enhanced: `loginStudent` Function

- Updated to return `username` in user object
- Maintains backward compatibility

#### Existing OTP Functions

- `loginSendOTP` - Send OTP for passwordless login
- `loginVerifyOTP` - Verify OTP and return JWT
- `forgotPassword` - Send password reset link
- `resetPassword` - Reset password with token

---

### 2. Route Updates (`authRoutes.js`)

**New Route:**

```javascript
POST /api/auth/login-username
Rate Limit: 5 attempts per 15 minutes
Middleware: loginRateLimiter
```

**Updated Route:**

```javascript
POST /api/auth/login
Rate Limit: 5 attempts per 15 minutes (now with middleware)
```

**All Login Endpoints:**
| Endpoint | Method | Rate Limit | Purpose |
|----------|--------|-----------|---------|
| `/login` | POST | 5/15min | Email + password |
| `/login-username` | POST | 5/15min | Username + password |
| `/login-send-otp` | POST | 3/5min | Send OTP |
| `/login-verify` | POST | 5/5min | Verify OTP |
| `/forgot-password` | POST | 3/30min | Request reset |
| `/reset-password` | POST | — | Reset password |

---

## Frontend Implementation

### Login.jsx - Complete Rewrite

#### 3 Authentication Tabs

**Tab 1: Username & Password**

- Input: username, password
- Endpoint: `POST /api/auth/login-username`
- Features:
  - Auto-lowercase username on submit
  - Email verification validation
  - Direct navigation to dashboard

**Tab 2: Email & Password**

- Input: email, password
- Endpoint: `POST /api/auth/login`
- Features:
  - Forgot password button (switches to OTP tab)
  - Email verification validation
  - Same validation as username

**Tab 3: OTP Login (Multi-Stage)**

**Stage 1: Send OTP**

- Input: email
- Endpoint: `POST /api/auth/login-send-otp`
- Response: Success message, switches to verify stage

**Stage 2: Verify OTP**

- Input: 6-digit OTP (using 6 individual input boxes)
- Endpoint: `POST /api/auth/login-verify`
- Features:
  - Auto-focus next input on digit entry
  - Backspace support (focus previous input)
  - All 6 digits required
  - Success → Navigate to dashboard

**Stage 3: Password Reset (from Forgot Password)**

- Input: reset token, new password, confirm password
- Endpoint: `POST /api/auth/reset-password`
- Features:
  - Token from password reset email
  - Password validation (min 6 chars)
  - Password confirmation match check
  - Success → Return to send OTP stage

---

## Component Features

### Tab Navigation

```jsx
<div className="flex gap-2 mb-6 bg-muted rounded-lg p-1">
  <button onClick={() => setActiveTab("username")}>Username</button>
  <button onClick={() => setActiveTab("email")}>Email</button>
  <button onClick={() => setActiveTab("otp")}>OTP</button>
</div>
```

### OTP Input Boxes (6-Digit Code)

```jsx
<div className="flex gap-2 justify-center">
  {otpCode.map((digit, index) => (
    <Input
      id={`otp-${index}`}
      maxLength="1"
      onChange={(e) => handleOtpChange(index, e.target.value)}
      onKeyDown={(e) => handleBackspace(index, e)}
    />
  ))}
</div>
```

**Features:**

- ✅ Auto-advance to next input
- ✅ Backspace to previous input
- ✅ Numeric only input
- ✅ Centered display
- ✅ Large font for readability

### Error Handling

All errors show toast notifications:

- "Invalid credentials" - Wrong username/password
- "Email not verified" - Email verification required
- "OTP expired" - Request new OTP
- "Invalid OTP" - Try again
- "Passwords do not match" - Password reset
- "Password must be at least 6 characters" - Password validation

---

## User Flow Diagrams

### Flow 1: Username & Password Login

```
Username Tab
    ↓
Enter username & password
    ↓
POST /api/auth/login-username
    ↓
✓ Valid → Save token → Dashboard
✗ Email not verified → Show error
✗ Invalid → Show error
```

### Flow 2: Email & Password Login

```
Email Tab
    ↓
Enter email & password
    ↓
POST /api/auth/login
    ↓
✓ Valid → Save token → Dashboard
✗ Email not verified → Show error
✗ Invalid → Show error
    ↓
[Forgot Password Link]
    ↓
Switch to OTP Tab → Verify Email Stage
```

### Flow 3: Passwordless OTP Login

```
OTP Tab - Stage 1: Send
    ↓
Enter email → POST /api/auth/login-send-otp
    ↓
OTP Tab - Stage 2: Verify (Switch auto)
    ↓
Enter 6-digit OTP → POST /api/auth/login-verify
    ↓
✓ Valid → Save token → Dashboard
✗ Expired/Invalid → Show error & back button
```

### Flow 4: Forgot Password (via Email/OTP Tab)

```
Email Tab - Forgot Password Link
    ↓
OTP Tab - Stage 1: Send
    ↓
Enter email → POST /api/auth/forgot-password
    ↓
Check email for reset link (contains token)
    ↓
OTP Tab - Stage 3: Reset
    ↓
Paste token + new password
    ↓
POST /api/auth/reset-password
    ↓
✓ Valid → Return to Send OTP Stage
✗ Invalid/Expired → Show error
```

---

## State Management

### Login Component State

```javascript
// Tab selection
const [activeTab, setActiveTab] = useState("username"); // username, email, otp

// Username & Password
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

// Email & Password
const [emailLogin, setEmailLogin] = useState("");
const [passwordLogin, setPasswordLogin] = useState("");

// OTP Login
const [otpEmail, setOtpEmail] = useState("");
const [otpStage, setOtpStage] = useState("send"); // send, verify, reset
const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
const [resetToken, setResetToken] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

// UI State
const [isLoading, setIsLoading] = useState(false);
```

---

## API Integration

### Environment Variables

```bash
VITE_API_URL=http://localhost:5000/api
```

### API Client Setup

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const response = await axios.post(`${API_URL}/auth/login-username`, {
  username,
  password,
});
```

### Response Storage

```javascript
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));
```

---

## Validation Rules

### Username

- ✓ 3-30 characters
- ✓ Lowercase letters, numbers, underscores, hyphens
- ✓ Unique in database
- ✗ Spaces, special characters (except - and \_)

### Email

- ✓ Valid email format
- ✓ Unique in database
- ✓ Must be verified for login

### Password

- ✓ Minimum 6 characters
- ✓ Hashed with bcryptjs (10 salt rounds)
- ✓ Never stored in plain text

### OTP

- ✓ 6-digit code
- ✓ Generated randomly
- ✓ Expires in 5 minutes
- ✓ Stored in Redis

### Reset Token

- ✓ Random 32-byte hex string
- ✓ Hashed with SHA256
- ✓ Expires in 30 minutes
- ✓ Sent via email

---

## Security Features

1. **Rate Limiting**

   - Login attempts: 5/15 minutes
   - OTP requests: 3/5 minutes
   - OTP verification: 5/5 minutes
   - Password reset: 3/30 minutes

2. **Email Verification**

   - Required before login
   - OTP-based (5-minute TTL)
   - Cannot be bypassed

3. **JWT Tokens**

   - 7-day expiration
   - Signed with JWT_SECRET
   - Stored in localStorage

4. **Password Security**

   - Bcryptjs hashing (10 rounds)
   - Never transmitted in logs
   - Reset via secure token

5. **OTP Security**
   - Redis-based storage
   - Cannot be guessed (1 in 1 million)
   - Expires automatically

---

## Testing Endpoints

### 1. Username Login

```bash
curl -X POST http://localhost:5000/api/auth/login-username \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"SecurePass123"}'
```

### 2. Email Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

### 3. Send OTP

```bash
curl -X POST http://localhost:5000/api/auth/login-send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

### 4. Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/login-verify \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","otp":"123456"}'
```

### 5. Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

### 6. Reset Password

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"token_from_email","password":"NewPass456"}'
```

---

## Files Modified

### Backend

- ✅ `src/controllers/authController.js` - Added `loginWithUsername`
- ✅ `src/routes/authRoutes.js` - Added `/login-username` route
- ✅ `src/models/Student.js` - Already has username field

### Frontend

- ✅ `src/pages/Login.jsx` - Complete rewrite with 3 tabs

---

## Next Steps

1. **Test all endpoints** with cURL commands above
2. **Update AuthContext** to use new login methods
3. **Set up email service** (Ethereal for dev, Resend for prod)
4. **Create registration page** with username input
5. **Add "Remember Me"** functionality if needed
6. **Implement auto-logout** on token expiry

---

## Troubleshooting

**Issue:** "Email not verified" on login

- **Solution:** Register first and verify email with OTP

**Issue:** "Invalid credentials"

- **Solution:** Check username/email spelling and password

**Issue:** OTP not received

- **Solution:** Check email inbox/spam, check Ethereal preview

**Issue:** Reset token invalid

- **Solution:** Token expires in 30 minutes, request new one

**Issue:** Rate limit exceeded

- **Solution:** Wait for retry window (shown in error message)

---

## Architecture

```
Frontend (Login.jsx)
    ↓
Axios HTTP Client
    ↓
Backend Express Routes
    ↓
Auth Controller
    ↓
↙         ↓         ↘
Student   Redis    Email
Model    (OTP)    Service
```

All components work together to provide a secure, user-friendly authentication experience.
