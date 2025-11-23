const mongoose = require('mongoose');
const { logger } = require('../config/logger');
const Student = require('../models/Student');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Badge = require('../models/Badge');
const Project = require('../models/Project');
const redis = require('../config/redis');

// const Student = mongoose.model('Student');
// const Badge = mongoose.model('Badge');
// const Project = mongoose.model('Project');
// const Event = mongoose.model('Event');
// const Announcement = mongoose.model('Announcement');

exports.getDashboardData = async (req, res) => {
    try {
        const studentId = req.user.id;

        // console.log(req.user)

        // Get current student data
        const student = await Student.findById(studentId)
            .populate({
                path: 'badges',
                select: 'name icon points description'
            })
            .populate({
                path: 'approvedProjects',
                select: 'title'
            });

        // console.log(student)

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let cacheKey = `studentDashboardData:${studentId}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log('Serving dashboard data from cache');
            return res.status(200).json(JSON.parse(cached));
        }

        console.log('cache miss')

        // Count events
        const eventsCount = await Event.countDocuments();

        // Count earned badges
        const badgesEarned = student.badges.length;

        // Count submitted projects (approved projects)
        const projectsSubmitted = student.approvedProjects.length;

        // Calculate total points from earned badges
        const totalPoints = student.badges.reduce((sum, badge) => sum + badge.points, 0);

        // Get all announcements
        const announcements = await Announcement.find()
            .select('title content createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get all events
        const events = await Event.find()
            .select('title description status createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get student's approved projects with only title
        const projects = student.approvedProjects.map(project => ({
            _id: project._id,
            title: project.title
        }));

        const dashboardData = {
            counts: {
                events: eventsCount,
                badgesEarned,
                projectsSubmitted,
                totalPoints
            },
            announcements,
            events,
            projects
        };

        await redis.set(cacheKey, JSON.stringify(dashboardData), 'EX', 300); // Cache for 5 minutes

        // logger.info(`Dashboard data retrieved for student ${studentId}`);

        res.status(200).json(dashboardData);
    } catch (error) {
        logger.error(`Error fetching dashboard data: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
    }
};

/**
 * Get admin dashboard statistics
 * Returns: totalStudents, totalEvents, totalPendingProjects, totalBadges
 * Cached in Redis for 5 minutes
 */
exports.getAdminDashboardData = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        // Check Redis cache first
        const cacheKey = 'adminDashboardStats';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            logger.info('Serving admin dashboard stats from cache');
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
                cached: true
            });
        }

        logger.info('Cache miss - fetching admin dashboard stats from database');

        // Fetch all counts in parallel
        const [totalStudents, totalEvents, totalPendingProjects, totalBadges] = await Promise.all([
            Student.countDocuments({ role: 'student' }),
            Event.countDocuments(),
            Project.countDocuments({ approved: false }),
            Badge.countDocuments()
        ]);

        const dashboardStats = {
            totalStudents,
            totalEvents,
            totalPendingProjects,
            totalBadges,
            timestamp: new Date().toISOString()
        };

        // Cache for 5 minutes (300 seconds)
        await redis.setex(cacheKey, 300, JSON.stringify(dashboardStats));

        res.status(200).json({
            success: true,
            data: dashboardStats,
            cached: false
        });

    } catch (error) {
        logger.error(`Error fetching admin dashboard stats: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch admin dashboard stats',
            error: error.message
        });
    }
};
