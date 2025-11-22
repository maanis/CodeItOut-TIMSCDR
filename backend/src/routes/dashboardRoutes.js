const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Get dashboard data for current student
router.get('/', auth, dashboardController.getDashboardData);

module.exports = router;
