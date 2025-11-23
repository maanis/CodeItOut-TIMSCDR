const express = require('express');
const { getLeaderboard, updateLeaderboard, rebuildLeaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get leaderboard with pagination (sorted by points highest to lowest)
// @access  Public
// @query   page - page number (default: 1)
// @query   limit - items per page (default: 10)
router.get('/', getLeaderboard);

// @route   POST /api/leaderboard/update/:studentId
// @desc    Update a specific student's leaderboard data
// @access  Private
router.post('/update/:studentId', updateLeaderboard);

// @route   POST /api/leaderboard/rebuild
// @desc    Rebuild entire leaderboard from database
// @access  Private
router.post('/rebuild', rebuildLeaderboard);

module.exports = router;
