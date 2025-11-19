const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {

        console.log('innn')
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ userId });

        res.json({
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const count = await Notification.countDocuments({ userId, hasRead: false });

        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { hasRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const result = await Notification.updateMany(
            { userId, hasRead: false },
            { hasRead: true }
        );

        res.json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private (Admin/Teacher)
const createNotification = async (req, res) => {
    try {
        const { title, content, userId, type } = req.body;

        if (!content || !userId) {
            return res.status(400).json({ error: 'Content and userId are required' });
        }

        const notification = new Notification({
            title,
            content,
            userId: new mongoose.Types.ObjectId(userId),
            type: type || 'system'
        });

        await notification.save();

        res.status(201).json({
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification
};