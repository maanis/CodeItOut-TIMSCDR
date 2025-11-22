const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const redis = require('../config/redis');
const { logger } = require('../config/logger');
const { sendOTPEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../config/emailService');

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// ========== REGISTRATION & EMAIL VERIFICATION ==========

// Send OTP for email verification
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Check if email already exists and verified
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in Redis with 5-minute expiry
        const otpKey = `otp:${email}`;
        await redis.setex(otpKey, 300, otp);

        // Send OTP email
        try {
            await sendOTPEmail(email, otp, 'User', 5);
        } catch (emailError) {
            logger.error(`Failed to send OTP email: ${emailError.message}`);
        }

        logger.info(`OTP sent to ${email}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            email: email,
        });
    } catch (error) {
        logger.error(`Send OTP error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
        });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        // Retrieve OTP from Redis
        const otpKey = `otp:${email}`;
        const storedOTP = await redis.get(otpKey);

        if (!storedOTP) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or invalid. Please request a new OTP.',
            });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Mark OTP as verified in Redis
        const verificationKey = `email:verified:${email}`;
        await redis.setex(verificationKey, 3600, 'true'); // Valid for 1 hour

        // Delete OTP
        await redis.del(otpKey);

        logger.info(`Email verified for ${email}`);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            email: email,
        });
    } catch (error) {
        logger.error(`Verify OTP error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
        });
    }
};

// Register student with email verification
const registerStudent = async (req, res) => {
    try {
        const { name, email, username, password, roll } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, username, and password are required',
            });
        }

        // Validate username format
        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                success: false,
                message: 'Username must be between 3 and 30 characters',
            });
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username can only contain letters, numbers, underscores, and hyphens',
            });
        }

        // Check if email is verified
        const verificationKey = `email:verified:${email}`;
        const isVerified = await redis.get(verificationKey);

        if (!isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email not verified. Please verify your email first.',
            });
        }

        // Check if email already exists
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // Check if username already exists
        const existingUsername = await Student.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken. Please choose another username.',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle image upload if provided
        let avatarUrl = null;
        if (req.file) {
            avatarUrl = `/uploads/${req.file.filename}`;
        }

        // Create student
        const student = new Student({
            name,
            email,
            username: username.toLowerCase(),
            password: hashedPassword,
            roll: roll || null,
            avatarUrl,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
        });

        await student.save();

        // Send welcome email
        try {
            await sendWelcomeEmail(email, name);
        } catch (emailError) {
            logger.error(`Failed to send welcome email: ${emailError.message}`);
        }

        // Delete verification key
        await redis.del(verificationKey);

        // Generate JWT
        const token = jwt.sign(
            { id: student._id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        logger.info(`Student registered: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                username: student.username,
                avatarUrl: student.avatarUrl,
                isEmailVerified: student.isEmailVerified,
            },
        });
    } catch (error) {
        logger.error(`Register student error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
        });
    }
};

// ========== LOGIN ==========

// Traditional login with email and password
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Check if email includes 'admin' to determine user type
        const isAdmin = email.toLowerCase().includes('admin');

        let user, userRole;

        if (isAdmin) {
            // Search in Teacher model for admin
            user = await Teacher.findOne({ email });
            userRole = 'admin';
        } else {
            // Search in Student model for regular user
            user = await Student.findOne({ email });
            userRole = 'student';
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if email is verified (for students only)
        if (!isAdmin && !user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Email not verified. Please verify your email first.',
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password || '');

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        logger.info(`${isAdmin ? 'Teacher' : 'Student'} logged in: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: userRole,
                ...(userRole === 'student' && {
                    avatarUrl: user.avatarUrl,
                    username: user.username,
                    badges: user.badges || [],
                    projects: user.approvedProjects || [],
                    isEmailVerified: user.isEmailVerified,
                }),
            },
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Login failed',
        });
    }
};

// Login with username and password
const loginWithUsername = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
            });
        }

        // Find student by username
        const student = await Student.findOne({ username: username.toLowerCase() });

        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if email is verified
        if (!student.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Email not verified. Please verify your email first.',
                email: student.email,
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, student.password || '');

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: student._id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        logger.info(`Student logged in with username: ${username}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                username: student.username,
                isEmailVerified: student.isEmailVerified,
            },
        });
    } catch (error) {
        logger.error(`Login with username error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Login failed',
        });
    }
};

// ========== PASSWORDLESS LOGIN (OTP-based) ==========

// Send OTP for passwordless login
const loginSendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Check if email includes 'admin' to determine user type
        const isAdmin = email.toLowerCase().includes('admin');

        let user;

        if (isAdmin) {
            // Search in Teacher model for admin
            user = await Teacher.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found',
                });
            }
        } else {
            // Search in Student model for regular user
            user = await Student.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found or email not verified',
                });
            }
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in Redis with 5-minute expiry
        const loginOtpKey = `login:otp:${email}`;
        await redis.setex(loginOtpKey, 300, otp);

        // Send OTP email
        try {
            await sendOTPEmail(email, otp, user.name, 5);
        } catch (emailError) {
            logger.error(`Failed to send login OTP email: ${emailError.message}`);
        }

        logger.info(`Login OTP sent to ${email}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            email: email,
        });
    } catch (error) {
        logger.error(`Login send OTP error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
        });
    }
};

// Verify OTP and login
const loginVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        // Retrieve OTP from Redis
        const loginOtpKey = `login:otp:${email}`;
        const storedOTP = await redis.get(loginOtpKey);

        if (!storedOTP) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new OTP.',
            });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Check if email includes 'admin' to determine user type
        const isAdmin = email.toLowerCase().includes('admin');

        let user, userRole;

        if (isAdmin) {
            // Search in Teacher model for admin
            user = await Teacher.findOne({ email });
            userRole = 'admin';
        } else {
            // Search in Student model for regular user
            user = await Student.findOne({ email });
            userRole = 'student';
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update email verification status for students
        if (userRole === 'student') {
            user.isEmailVerified = true;
            user.emailVerifiedAt = new Date();
            await user.save();
        }

        // Delete OTP
        await redis.del(loginOtpKey);

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        logger.info(`${isAdmin ? 'Teacher' : 'Student'} logged in via OTP: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: userRole,
                ...(userRole === 'student' && {
                    avatarUrl: user.avatarUrl,
                    badges: user.badges || [],
                    projects: user.approvedProjects || [],
                    isEmailVerified: user.isEmailVerified,
                }),
            },
        });
    } catch (error) {
        logger.error(`Login verify OTP error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Login failed',
        });
    }
};

// ========== FORGOT PASSWORD & RESET ==========

// Forgot password - send reset link
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Find student
        const student = await Student.findOne({ email });

        if (!student || !student.isEmailVerified) {
            // Don't reveal if email exists for security
            return res.status(200).json({
                success: true,
                message: 'If email exists, a password reset link has been sent',
            });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Store hashed token in Redis with 30-minute expiry
        const resetKey = `password:reset:${hashedToken}`;
        await redis.setex(resetKey, 1800, email);

        // Create reset link
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${resetToken}`;

        // Send email
        try {
            await sendPasswordResetEmail(email, resetLink, student.name, 30);
        } catch (emailError) {
            logger.error(`Failed to send password reset email: ${emailError.message}`);
        }

        logger.info(`Password reset link sent to ${email}`);

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email',
        });
    } catch (error) {
        logger.error(`Forgot password error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset',
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token and password are required',
            });
        }

        // Hash token to find in Redis
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const resetKey = `password:reset:${hashedToken}`;

        // Retrieve email from Redis
        const email = await redis.get(resetKey);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        // Find student and update password
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        student.password = hashedPassword;
        await student.save();

        // Delete reset token
        await redis.del(resetKey);

        logger.info(`Password reset for ${email}`);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        logger.error(`Reset password error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
        });
    }
};

// Keep existing functions for backward compatibility
const login = async (req, res) => {
    return loginStudent(req, res);
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        logger.error(`Logout error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
};

const isAuthenticated = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.json({ authenticated: false });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.json({ authenticated: false });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            let user;

            // Check if it's a teacher (admin) or student based on role
            if (decoded.role === 'teacher') {
                user = await Teacher.findById(decoded.id);
            } else {
                user = await Student.findById(decoded.id);
            }

            if (!user) {
                return res.json({ authenticated: false });
            }

            res.json({
                authenticated: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: decoded.role,
                    ...(decoded.role === 'student' && {
                        avatarUrl: user.avatarUrl,
                        username: user.username,
                        badges: user.badges || [],
                        projects: user.approvedProjects || [],
                        isEmailVerified: user.isEmailVerified,
                        totalPoints: user.totalPoints || 0,
                    }),
                }
            });
        } catch (error) {
            return res.json({ authenticated: false });
        }
    } catch (error) {
        logger.error(`Authentication check error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Authentication check failed' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    registerStudent,
    loginStudent,
    loginWithUsername,
    loginSendOTP,
    loginVerifyOTP,
    forgotPassword,
    resetPassword,
    login,
    logout,
    isAuthenticated,
};