const pino = require('pino');
const pinoHttp = require('pino-http');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create write streams for logs
const logFilePath = path.join(logsDir, 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Create base logger instance with both console and file output
const logger = pino(
    {
        level: process.env.LOG_LEVEL || 'info',
    },
    pino.transport({
        targets: [
            {
                target: 'pino/file',
                options: {
                    destination: logFilePath,
                    mkdir: true,
                }
            },
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    singleLine: false,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                }
            }
        ]
    })
);

// HTTP request logger middleware
const httpLogger = pinoHttp({
    logger: logger,
    // Customize what gets logged
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
        } else if (res.statusCode >= 500 || err) {
            return 'error';
        }
        return 'info';
    },
    // Customize request serialization
    serializers: {
        req(request) {
            return {
                method: request.method,
                url: request.url,
                path: request.path,
                headers: {
                    host: request.headers.host,
                    'user-agent': request.headers['user-agent'],
                    'content-type': request.headers['content-type'],
                },
                remoteAddress: request.ip,
                remotePort: request.socket?.remotePort,
            };
        },
        res(response) {
            return {
                statusCode: response.statusCode,
                responseTime: response.responseTime,
            };
        },
    },
    // Log response time and detailed information
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
    },
    // Skip certain routes if needed
    skip: (req, res) => {
        // Don't log health checks if you want
        if (req.url === '/api/health') {
            return false; // Set to true to skip health check logs
        }
        return false;
    },
});

module.exports = {
    logger,
    httpLogger,
};
