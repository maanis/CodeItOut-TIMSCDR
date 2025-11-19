const express = require('express');
const { getLogs, getLogStats } = require('../controllers/logsController');
const auth = require('../middleware/auth');

const router = express.Router();

// All log routes require authentication
router.use(auth);

// @route   GET /api/logs
// @desc    Get application logs with pagination and filtering
// @access  Private (Admin/Teacher only)
router.get('/', getLogs);

// @route   GET /api/logs/stats
// @desc    Get log statistics
// @access  Private (Admin/Teacher only)
router.get('/stats', getLogStats);

module.exports = router;
