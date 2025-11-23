const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Get dashboard data for current student
router.get('/', auth, dashboardController.getDashboardData);

// Get admin dashboard data
router.get('/admin/stats', auth, dashboardController.getAdminDashboardData);

module.exports = router;
