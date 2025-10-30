const express = require('express');
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification
} = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

// All notification routes require authentication
router.use(auth);

// @route   GET /api/notifications
// @desc    Get notifications for authenticated user
// @access  Private
router.get('/', getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', getUnreadCount);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', markAllAsRead);

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private (Admin/Teacher)
router.post('/', createNotification);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', deleteNotification);

module.exports = router;