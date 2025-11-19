const fs = require('fs');
const path = require('path');
const { logger } = require('../config/logger');

// @desc    Get application logs with pagination, filtering, and search
// @route   GET /api/logs
// @access  Private (Admin/Teacher only)
const getLogs = async (req, res) => {
    try {
        // Check if user is admin or teacher
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Access denied. Only admins and teachers can view logs.' });
        }

        const { page = 1, limit = 50, level, search, startDate, endDate } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50)); // Max 100 per page
        const skip = (pageNum - 1) * limitNum;

        const logsDir = path.join(__dirname, '../../logs');
        const logFile = path.join(logsDir, 'app.log');

        // Check if log file exists
        if (!fs.existsSync(logFile)) {
            logger.warn({ logFile }, 'Log file not found');
            return res.json({
                logs: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: 0,
                    pages: 0
                },
                message: 'No logs available yet'
            });
        }

        // Read log file
        let fileContent = '';
        try {
            fileContent = fs.readFileSync(logFile, 'utf-8');
        } catch (readError) {
            logger.error({ error: readError.message }, 'Failed to read log file');
            return res.status(500).json({ error: 'Failed to read log file' });
        }

        if (!fileContent.trim()) {
            return res.json({
                logs: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: 0,
                    pages: 0
                },
                message: 'Log file is empty'
            });
        }

        const lines = fileContent.trim().split('\n').filter(line => line.trim().length > 0);

        // Parse and filter logs
        let parsedLogs = lines.map((line, index) => {
            try {
                return {
                    id: `${Date.now()}-${index}`,
                    ...JSON.parse(line)
                };
            } catch (e) {
                // Skip invalid JSON lines
                return null;
            }
        }).filter(log => log !== null);

        // Reverse to show newest first
        parsedLogs = parsedLogs.reverse();

        // Apply filters
        let filteredLogs = parsedLogs;

        // Filter by level (30=info, 40=warn, 50=error, 60=fatal)
        if (level) {
            const levelMap = { debug: 20, info: 30, warn: 40, error: 50, fatal: 60 };
            const levelValue = levelMap[level.toLowerCase()];
            if (levelValue) {
                filteredLogs = filteredLogs.filter(log => log.level === levelValue);
            }
        }

        // Filter by status code range (for HTTP logs)
        if (req.query.statusCode) {
            const statusCode = parseInt(req.query.statusCode);
            if (statusCode) {
                if (statusCode === 200) filteredLogs = filteredLogs.filter(log => log.res?.statusCode >= 200 && log.res?.statusCode < 300);
                else if (statusCode === 400) filteredLogs = filteredLogs.filter(log => log.res?.statusCode >= 400 && log.res?.statusCode < 500);
                else if (statusCode === 500) filteredLogs = filteredLogs.filter(log => log.res?.statusCode >= 500);
            }
        }

        // Filter by date range
        if (startDate || endDate) {
            filteredLogs = filteredLogs.filter(log => {
                if (!log.time) return false;
                const logTime = new Date(log.time);
                if (startDate) {
                    const start = new Date(startDate);
                    if (logTime < start) return false;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999); // Include entire day
                    if (logTime > end) return false;
                }
                return true;
            });
        }

        // Search in URL, method, error message
        if (search) {
            const searchLower = search.toLowerCase();
            filteredLogs = filteredLogs.filter(log => {
                const url = log.url?.toLowerCase() || '';
                const method = log.method?.toLowerCase() || '';
                const message = log.msg?.toLowerCase() || '';
                const errorMsg = log.error?.toLowerCase() || '';
                return url.includes(searchLower) || method.includes(searchLower) || message.includes(searchLower) || errorMsg.includes(searchLower);
            });
        }

        // Get total count before pagination
        const total = filteredLogs.length;

        // Apply pagination
        const paginatedLogs = filteredLogs.slice(skip, skip + limitNum);

        // Format response
        const formattedLogs = paginatedLogs.map(log => ({
            id: log.id,
            timestamp: log.time ? new Date(log.time).toISOString() : new Date().toISOString(),
            level: getLevelName(log.level),
            method: log.req?.method || log.method,
            url: log.req?.url || log.url,
            statusCode: log.res?.statusCode,
            responseTime: log.res?.responseTime,
            message: log.msg,
            error: log.error,
            errorStack: log.stack,
            userId: log.userId,
            ipAddress: log.req?.remoteAddress,
            userAgent: log.req?.headers?.['user-agent'],
        }));

        logger.info({ total, page: pageNum, limit: limitNum, returned: formattedLogs.length }, 'Returning formatted logs');

        res.json({
            logs: formattedLogs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        logger.error({ error: error.message, stack: error.stack }, 'Error fetching logs');
        res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
    }
};

// @desc    Get log statistics
// @route   GET /api/logs/stats
// @access  Private (Admin/Teacher only)
const getLogStats = async (req, res) => {
    try {
        // Check if user is admin or teacher
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const logsDir = path.join(__dirname, '../../logs');
        const logFile = path.join(logsDir, 'app.log');

        if (!fs.existsSync(logFile)) {
            return res.json({
                totalLogs: 0,
                successCount: 0,
                clientErrorCount: 0,
                serverErrorCount: 0,
                avgResponseTime: 0
            });
        }

        const fileContent = fs.readFileSync(logFile, 'utf-8');
        const lines = fileContent.trim().split('\n').filter(line => line.length > 0);

        const stats = {
            totalLogs: lines.length,
            successCount: 0,
            clientErrorCount: 0,
            serverErrorCount: 0,
            responseTimes: [],
            levelCounts: {}
        };

        lines.forEach(line => {
            try {
                const log = JSON.parse(line);
                const statusCode = log.res?.statusCode;
                const responseTime = log.res?.responseTime;

                if (statusCode) {
                    if (statusCode >= 200 && statusCode < 300) stats.successCount++;
                    else if (statusCode >= 400 && statusCode < 500) stats.clientErrorCount++;
                    else if (statusCode >= 500) stats.serverErrorCount++;
                }

                if (responseTime) {
                    stats.responseTimes.push(responseTime);
                }

                const levelName = getLevelName(log.level);
                stats.levelCounts[levelName] = (stats.levelCounts[levelName] || 0) + 1;
            } catch (e) {
                // Skip invalid JSON lines
            }
        });

        const avgResponseTime = stats.responseTimes.length > 0
            ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length).toFixed(2)
            : 0;

        res.json({
            totalLogs: stats.totalLogs,
            successCount: stats.successCount,
            clientErrorCount: stats.clientErrorCount,
            serverErrorCount: stats.serverErrorCount,
            avgResponseTime: parseFloat(avgResponseTime),
            levelCounts: stats.levelCounts
        });
    } catch (error) {
        logger.error({ error: error.message }, 'Error fetching log stats');
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Helper function to convert log level number to name
const getLevelName = (level) => {
    const levelMap = {
        20: 'debug',
        30: 'info',
        40: 'warn',
        50: 'error',
        60: 'fatal'
    };
    return levelMap[level] || 'unknown';
};

module.exports = {
    getLogs,
    getLogStats
};
