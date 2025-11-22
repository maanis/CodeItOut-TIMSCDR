const redis = require('../config/redis');
const { logger } = require('../config/logger');

// Generic rate limiter factory
const createRateLimiter = (keyPrefix, maxAttempts = 5, windowSeconds = 300) => {
    return async (req, res, next) => {
        try {
            const identifier = req.body.email || req.ip;
            const key = `${keyPrefix}:${identifier}`;

            const attempts = await redis.incr(key);

            // Set expiry on first request
            if (attempts === 1) {
                await redis.expire(key, windowSeconds);
            }

            if (attempts > maxAttempts) {
                const ttl = await redis.ttl(key);
                logger.warn(`Rate limit exceeded for ${keyPrefix} - ${identifier}`);
                return res.status(429).json({
                    success: false,
                    message: `Too many attempts. Please try again in ${ttl} seconds.`,
                    retryAfter: ttl,
                });
            }

            // Pass remaining attempts to next middleware
            req.rateLimit = {
                attemptsRemaining: maxAttempts - attempts,
                attemptsMade: attempts,
            };

            next();
        } catch (error) {
            logger.error(`Rate limiter error: ${error.message}`);
            next(); // Continue on error to avoid blocking requests
        }
    };
};

// Login rate limiter: 5 attempts per 15 minutes
const loginRateLimiter = createRateLimiter('ratelimit:login', 5, 900);

// OTP request rate limiter: 3 attempts per 5 minutes
const otpRequestRateLimiter = createRateLimiter('ratelimit:otp:request', 3, 300);

// OTP verification rate limiter: 5 attempts per 5 minutes
const otpVerifyRateLimiter = createRateLimiter('ratelimit:otp:verify', 5, 300);

// Password reset rate limiter: 3 attempts per 30 minutes
const passwordResetRateLimiter = createRateLimiter('ratelimit:password:reset', 3, 1800);

// Registration rate limiter: 10 attempts per hour per IP
const registrationRateLimiter = async (req, res, next) => {
    try {
        const key = `ratelimit:register:${req.ip}`;
        const attempts = await redis.incr(key);

        if (attempts === 1) {
            await redis.expire(key, 3600); // 1 hour
        }

        if (attempts > 10) {
            const ttl = await redis.ttl(key);
            logger.warn(`Registration rate limit exceeded for IP: ${req.ip}`);
            return res.status(429).json({
                success: false,
                message: `Too many registration attempts. Please try again later.`,
                retryAfter: ttl,
            });
        }

        req.rateLimit = {
            attemptsRemaining: 10 - attempts,
            attemptsMade: attempts,
        };

        next();
    } catch (error) {
        logger.error(`Registration rate limiter error: ${error.message}`);
        next();
    }
};

module.exports = {
    createRateLimiter,
    loginRateLimiter,
    otpRequestRateLimiter,
    otpVerifyRateLimiter,
    passwordResetRateLimiter,
    registrationRateLimiter,
};
