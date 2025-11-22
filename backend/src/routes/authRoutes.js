const express = require('express');
const {
    sendOTP,
    verifyOTP,
    registerStudent,
    loginStudent,
    loginWithUsername,
    loginSendOTP,
    loginVerifyOTP,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated,
} = require('../controllers/authController');
const { otpRequestRateLimiter, otpVerifyRateLimiter, loginRateLimiter, passwordResetRateLimiter, registrationRateLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../config/multer');

const router = express.Router();

// ========== EMAIL VERIFICATION & REGISTRATION ==========

// @route   POST /api/auth/send-otp
// @desc    Send OTP for email verification
// @access  Public
router.post('/send-otp', otpRequestRateLimiter, sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for email verification
// @access  Public
router.post('/verify-otp', otpVerifyRateLimiter, verifyOTP);

// @route   POST /api/auth/register
// @desc    Register student with email verification and profile image
// @access  Public
router.post('/register', registrationRateLimiter, upload.single('profileImage'), registerStudent);

// ========== LOGIN - PASSWORD-BASED ==========

// @route   POST /api/auth/login
// @desc    Login student with email and password
// @access  Public
router.post('/login', loginRateLimiter, loginStudent);

// @route   POST /api/auth/login-username
// @desc    Login student with username and password
// @access  Public
router.post('/login-username', loginRateLimiter, loginWithUsername);

// ========== LOGIN - PASSWORDLESS (OTP-based) ==========

// @route   POST /api/auth/login-send-otp
// @desc    Send OTP for passwordless login
// @access  Public
router.post('/login-send-otp', otpRequestRateLimiter, loginSendOTP);

// @route   POST /api/auth/login-verify
// @desc    Verify OTP and login
// @access  Public
router.post('/login-verify', otpVerifyRateLimiter, loginVerifyOTP);

// ========== FORGOT PASSWORD & RESET ==========

// @route   POST /api/auth/forgot-password
// @desc    Send password reset link
// @access  Public
router.post('/forgot-password', passwordResetRateLimiter, forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', resetPassword);

// ========== AUTHENTICATION STATE ==========

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', logout);

// @route   GET /api/auth/isAuthenticated
// @desc    Check if user is authenticated
// @access  Public
router.get('/isAuthenticated', isAuthenticated);

module.exports = router;