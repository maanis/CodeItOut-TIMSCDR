/**
 * Logger Usage Guide for Controllers and Services
 * 
 * This file demonstrates how to use the Pino logger throughout the application.
 * Pino automatically logs all HTTP requests/responses via httpLogger middleware,
 * but you can also use the logger instance for custom application logging.
 */

const { logger } = require('./logger');

// ============================================
// EXAMPLE 1: Basic Logging in Controllers
// ============================================
/*
const exampleController = async (req, res) => {
    const requestId = req.id; // Pino HTTP adds this automatically
    
    try {
        logger.info({ requestId }, 'Processing user registration');
        
        // ... your business logic
        
        logger.info({ requestId, userId }, 'User registered successfully');
        res.json({ message: 'Success' });
    } catch (error) {
        logger.error({ requestId, error: error.message }, 'User registration failed');
        res.status(500).json({ error: error.message });
    }
};
*/

// ============================================
// EXAMPLE 2: Logging with Metadata
// ============================================
/*
const createProject = async (req, res) => {
    const projectData = req.body;
    const userId = req.user.id;
    
    logger.info(
        { 
            userId, 
            projectTitle: projectData.title,
            techStack: projectData.techStack 
        }, 
        'Creating new project'
    );
    
    // ... create project logic
};
*/

// ============================================
// EXAMPLE 3: Different Log Levels
// ============================================
/*
logger.debug({ data }, 'Detailed debug information');           // DEBUG
logger.info({ action }, 'General information');                  // INFO
logger.warn({ warning }, 'Warning - something unexpected');      // WARN
logger.error({ error }, 'Error - something failed');             // ERROR
logger.fatal({ error }, 'Fatal - application must stop');        // FATAL
*/

// ============================================
// EXAMPLE 4: Error Logging with Stack Traces
// ============================================
/*
try {
    // ... some operation
} catch (error) {
    logger.error(
        { 
            error: error.message, 
            stack: error.stack,
            userId: req.user.id
        }, 
        'Database operation failed'
    );
    res.status(500).json({ error: 'Operation failed' });
}
*/

// ============================================
// EXAMPLE 5: Logging Database Operations
// ============================================
/*
const user = await User.findById(userId);
logger.debug({ userId, found: !!user }, 'User lookup completed');

const savedUser = await user.save();
logger.info({ userId }, 'User updated successfully');
*/

// ============================================
// WHAT PINO HTTP LOGS AUTOMATICALLY
// ============================================
/*
Every HTTP request/response is automatically logged with:
- Request method (GET, POST, etc.)
- Request URL and path
- Request headers (host, user-agent, content-type)
- Remote IP address
- Response status code
- Response time in milliseconds
- Log level based on status (info for 200-399, warn for 400-499, error for 500+)

Example log output:
  [13:45:23.456] INFO (pid=12345): GET /api/users 200
    req: {
      method: "GET"
      url: "/api/users"
      headers: {
        host: "localhost:5000"
        user-agent: "Mozilla/5.0..."
      }
      remoteAddress: "127.0.0.1"
    }
    res: {
      statusCode: 200
      responseTime: 45
    }
*/

// ============================================
// ENVIRONMENT VARIABLES
// ============================================
/*
Set these in your .env file to control logging:

LOG_LEVEL=info              # debug, info, warn, error, fatal
NODE_ENV=production         # production logs to file, dev to console

In production, logs are written to: logs/app.log
In development, logs appear in the console with pretty formatting
*/

module.exports = { logger };
