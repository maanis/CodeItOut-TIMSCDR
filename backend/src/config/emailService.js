const nodemailer = require('nodemailer');
const { logger } = require('./logger');

// For development, we'll use nodemailer. In production, integrate Resend.
let emailTransporter;

// Initialize email transporter
const initializeEmailService = () => {
    if (process.env.NODE_ENV === 'production') {
        // Use Resend for production (requires RESEND_API_KEY in .env)
        logger.info('Using Resend for email service (production)');
    } else {
        // Use nodemailer for development (Ethereal test account)
        emailTransporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Verify connection
        emailTransporter.verify((error, success) => {
            if (error) {
                logger.error('Email service verification failed:', error.message);
                logger.info('⚠️  Email service not connected. Get credentials from: https://ethereal.email');
            } else {
                logger.info('✓ Email service initialized successfully');
            }
        });
    }
};

// HTML email templates
const getOTPEmailHTML = (otp, userName, expiryMinutes = 5) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #3b82f6;
    }
    .content {
      text-align: center;
    }
    .otp-code {
      background: #3b82f6;
      color: white;
      font-size: 36px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 8px;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      display: inline-block;
    }
    .expiry {
      color: #666;
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">CodeItOut</div>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Use this code to verify your email address:</p>
      <div class="otp-code">${otp}</div>
      <p class="expiry">This code expires in ${expiryMinutes} minutes</p>
      <p style="color: #999; font-size: 12px;">Don't share this code with anyone. We'll never ask for it.</p>
    </div>
    <div class="footer">
      <p>© 2025 CodeItOut. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const getResetPasswordEmailHTML = (resetLink, userName, expiryMinutes = 30) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #3b82f6;
    }
    .content {
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      margin: 30px 0;
      font-weight: 600;
    }
    .button:hover {
      background: #2563eb;
    }
    .link-text {
      color: #999;
      font-size: 12px;
      word-break: break-all;
    }
    .expiry {
      color: #d97706;
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">CodeItOut</div>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p class="expiry">This link expires in ${expiryMinutes} minutes</p>
      <p style="color: #999; font-size: 12px;">Or copy this link:</p>
      <p class="link-text">${resetLink}</p>
      <p style="color: #999; font-size: 12px;">If you didn't request a password reset, ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2025 CodeItOut. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const getWelcomeEmailHTML = (userName, email) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CodeItOut</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #3b82f6;
    }
    .content {
      text-align: left;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .button:hover {
      background: #2563eb;
    }
    .action-items {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .action-item {
      margin: 10px 0;
      padding-left: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">CodeItOut</div>
    </div>
    <div class="content">
      <h2>Welcome to CodeItOut, ${userName}! 🎉</h2>
      <p>Your account is ready. Let's get started!</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
      <h3>What's Next?</h3>
      <div class="action-items">
        <div class="action-item">📝 Complete your profile</div>
        <div class="action-item">🏆 Explore contests and challenges</div>
        <div class="action-item">⭐ Earn badges and points</div>
        <div class="action-item">🤝 Connect with other learners</div>
      </div>
      <p>Questions? Contact our support team at support@codeitout.dev</p>
    </div>
    <div class="footer">
      <p>© 2025 CodeItOut. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Send OTP email
const sendOTPEmail = async (email, otp, userName, expiryMinutes = 5) => {
    try {
        const htmlContent = getOTPEmailHTML(otp, userName, expiryMinutes);

        if (process.env.NODE_ENV === 'production') {
            // Production: Use Resend API
            // const { Resend } = require('resend');
            // const resend = new Resend(process.env.RESEND_API_KEY);
            // await resend.emails.send({
            //   from: 'noreply@codeitout.com',
            //   to: email,
            //   subject: `Your CodeItOut Verification Code: ${otp}`,
            //   html: htmlContent,
            // });
        } else {
            // Development: Use nodemailer
            if (!emailTransporter) {
                logger.error('Email transporter not initialized. Check SMTP credentials in .env');
                throw new Error('Email service not initialized');
            }

            const info = await emailTransporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@codeitout.dev',
                to: email,
                subject: `Your CodeItOut Verification Code: ${otp}`,
                html: htmlContent,
            });

            logger.info(`✓ OTP email sent to ${email}`);
            logger.info(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return { success: true };
    } catch (error) {
        logger.error(`Failed to send OTP email to ${email}: ${error.message}`);
        throw error;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetLink, userName, expiryMinutes = 30) => {
    try {
        const htmlContent = getResetPasswordEmailHTML(resetLink, userName, expiryMinutes);

        if (process.env.NODE_ENV === 'production') {
            // Production: Use Resend API
            // const { Resend } = require('resend');
            // const resend = new Resend(process.env.RESEND_API_KEY);
            // await resend.emails.send({
            //   from: 'noreply@codeitout.com',
            //   to: email,
            //   subject: 'Reset Your CodeItOut Password',
            //   html: htmlContent,
            // });
        } else {
            // Development: Use nodemailer
            await emailTransporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@codeitout.dev',
                to: email,
                subject: 'Reset Your CodeItOut Password',
                html: htmlContent,
            });
        }

        logger.info(`Password reset email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
        throw error;
    }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
    try {
        const htmlContent = getWelcomeEmailHTML(userName, email);

        if (process.env.NODE_ENV === 'production') {
            // Production: Use Resend API
            // const { Resend } = require('resend');
            // const resend = new Resend(process.env.RESEND_API_KEY);
            // await resend.emails.send({
            //   from: 'noreply@codeitout.com',
            //   to: email,
            //   subject: 'Welcome to CodeItOut!',
            //   html: htmlContent,
            // });
        } else {
            // Development: Use nodemailer
            await emailTransporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@codeitout.dev',
                to: email,
                subject: 'Welcome to CodeItOut!',
                html: htmlContent,
            });
        }

        logger.info(`Welcome email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error(`Failed to send welcome email to ${email}: ${error.message}`);
        throw error;
    }
};

module.exports = {
    initializeEmailService,
    sendOTPEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
};
