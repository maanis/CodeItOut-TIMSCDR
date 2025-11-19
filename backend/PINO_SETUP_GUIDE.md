# Pino Logger Setup - Complete Guide

## Overview

Your application now uses **Pino**, a high-performance JSON logger perfect for production environments. It automatically logs every API call with request/response details and supports horizontal scaling.

## What's Configured

### 1. **Automatic HTTP Request/Response Logging**
- Every API call is logged automatically via `pino-http` middleware
- Logs include: method, URL, status code, response time, headers, IP address
- Log level is determined by HTTP status:
  - **INFO**: 2xx-3xx (success)
  - **WARN**: 4xx (client errors)
  - **ERROR**: 5xx (server errors)

### 2. **Files Modified/Created**

| File | Purpose |
|------|---------|
| `src/config/logger.js` | Pino configuration and middleware |
| `src/index.js` | Updated to use httpLogger middleware |
| `.env` | Added LOG_LEVEL and NODE_ENV |
| `src/config/LOGGER_USAGE.md` | Usage examples for controllers |

### 3. **Output**

**Development** (NODE_ENV=development):
- Pretty-printed logs to console
- Human-readable format with colors
- Easy to read during development

**Production** (NODE_ENV=production):
- JSON logs written to `logs/app.log`
- Optimized for log aggregation services (ELK, Splunk, CloudWatch, etc.)
- Can be streamed to external logging services

## How to Use

### Basic Request Logging (Automatic)

No code changes needed! Every API endpoint automatically logs:

```
GET /api/projects 200
  req: {
    method: "GET"
    url: "/api/projects"
    headers: { ... }
    remoteAddress: "127.0.0.1"
  }
  res: {
    statusCode: 200
    responseTime: 45
  }
```

### Custom Logging in Controllers

Import logger in your controllers:

```javascript
const { logger } = require('../config/logger');

const createProject = async (req, res) => {
    try {
        logger.info({ userId: req.user.id }, 'Creating project');
        
        const project = await Project.create({...});
        
        logger.info({ userId: req.user.id, projectId: project._id }, 'Project created');
        res.status(201).json(project);
    } catch (error) {
        logger.error({ userId: req.user.id, error: error.message }, 'Project creation failed');
        res.status(500).json({ error: error.message });
    }
};
```

### Log Levels

```javascript
logger.debug({ data }, 'Detailed information');    // DEBUG
logger.info({ action }, 'General information');    // INFO
logger.warn({ warning }, 'Something unexpected');  // WARN
logger.error({ error }, 'Operation failed');       // ERROR
logger.fatal({ error }, 'Critical failure');       // FATAL
```

## Environment Variables

Update your `.env` file:

```env
# Logging Configuration
LOG_LEVEL=info              # Minimum log level to display
NODE_ENV=development        # development | production

# In development: logs to console with pretty printing
# In production: logs to logs/app.log as JSON
```

## Production Setup

For production environments:

### 1. **Configure Logging Level**
```env
LOG_LEVEL=info
NODE_ENV=production
```

### 2. **Log Rotation** (using external tools)

Logs are written to `logs/app.log`. Use a tool like `logrotate` on Linux:

```bash
# /etc/logrotate.d/codeitout
/path/to/logs/app.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 3. **Log Aggregation Services**

Pino outputs JSON, making it compatible with:

- **AWS CloudWatch**: Use `logrotate` + agent
- **ELK Stack** (Elasticsearch, Logstash, Kibana): Parse JSON logs
- **Splunk**: Native JSON support
- **Datadog**: Native Pino integration
- **New Relic**: JSON log parsing

Example for streaming to CloudWatch:
```bash
npm install @datadog/browser-logs
```

### 4. **Monitoring Logs**

In production, tail logs:
```bash
tail -f logs/app.log | jq .
```

To filter by level:
```bash
tail -f logs/app.log | jq 'select(.level >= 40)'  # errors and fatals only
```

## Performance Benefits

✅ **High Performance**: Pino is one of the fastest Node.js loggers  
✅ **Scalable**: Logs are JSON - easy to parse and aggregate  
✅ **Low Overhead**: Minimal CPU/memory impact  
✅ **Structured Logging**: Attach metadata to logs for better debugging  
✅ **Child Loggers**: Can create child loggers for request-specific context  

## Common Issues & Solutions

### Issue: Logs not appearing
**Solution**: Check `LOG_LEVEL` environment variable is set to `info` or lower

### Issue: Logs to console in production
**Solution**: Set `NODE_ENV=production` to write to file instead

### Issue: Log file growing too large
**Solution**: Implement log rotation using `logrotate` or similar tools

## Viewing Logs

### Development (Console)
```bash
npm run dev
# Logs appear in terminal with colors and formatting
```

### Production (File)
```bash
# View last 100 lines
tail -100 logs/app.log

# Follow logs in real-time
tail -f logs/app.log

# Pretty print JSON logs
tail -f logs/app.log | jq '.'

# Filter by status code
tail -f logs/app.log | jq 'select(.res.statusCode >= 400)'
```

## Next Steps

1. ✅ Pino is now integrated and logging all API calls
2. Add custom logging to important business logic (see LOGGER_USAGE.md)
3. Set up log aggregation for production
4. Configure log rotation to manage disk space
5. Monitor logs for errors and performance issues

## References

- [Pino Documentation](https://getpino.io/)
- [Pino HTTP Middleware](https://github.com/pinojs/pino-http)
- [Pino Pretty](https://github.com/pinojs/pino-pretty)
