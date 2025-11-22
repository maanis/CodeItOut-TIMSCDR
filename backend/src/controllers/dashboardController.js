const mongoose = require('mongoose');
const { logger } = require('../config/logger');
const Student = require('../models/Student');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
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
