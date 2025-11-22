const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const redis = require('../config/redis');
const { logger } = require('../config/logger');

// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `notification:${userId}`;

        // Try to get from cache
        const cachedNotifications = await redis.get(cacheKey);
        if (cachedNotifications) {
            logger.info(`Notifications retrieved from cache for user ${userId}`);
            return res.json({
                notifications: JSON.parse(cachedNotifications)
            });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Get 10 latest notifications with only required fields
        const notifications = await Notification.find({ userId: userObjectId })
            .select('content hasRead type _id createdAt')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Cache for 5 minutes (300 seconds)
        await redis.setex(cacheKey, 300, JSON.stringify(notifications));

        logger.info(`Notifications retrieved from database for user ${userId}`);

        res.json({
            notifications
        });
    } catch (error) {
        logger.error(`Get notifications error: ${error.message}`);
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
        logger.error(`Get unread count error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const notificationId = req.params.id;
        const cacheKey = `notification:${userId}`;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId: userObjectId },
            { hasRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Invalidate cache
        await redis.del(cacheKey);

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        logger.error(`Mark as read error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const cacheKey = `notification:${userId}`;

        const result = await Notification.updateMany(
            { userId: userObjectId, hasRead: false },
            { hasRead: true }
        );

        // Invalidate cache
        await redis.del(cacheKey);

        res.json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        logger.error(`Mark all as read error: ${error.message}`);
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

        // Invalidate cache for the user
        const cacheKey = `notification:${userId}`;
        await redis.del(cacheKey);

        logger.info(`Notification created for user ${userId}`);

        res.status(201).json({
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        logger.error(`Create notification error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const notificationId = req.params.id;
        const cacheKey = `notification:${userId}`;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId: userObjectId
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Invalidate cache
        await redis.del(cacheKey);

        logger.info(`Notification ${notificationId} deleted for user ${userId}`);

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error(`Delete notification error: ${error.message}`);
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