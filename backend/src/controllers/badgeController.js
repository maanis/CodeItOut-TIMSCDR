const Badge = require('../models/Badge');
const Student = require('../models/Student');

// @desc    Create a new badge
// @route   POST /api/badges
// @access  Private (Admin only)
const createBadge = async (req, res) => {
    try {
        const { name, icon, points, description } = req.body;

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        if (!name || !icon || points === undefined) {
            return res.status(400).json({ error: 'Name, icon, and points are required' });
        }

        // Check if badge with same name already exists
        const existingBadge = await Badge.findOne({ name: name.trim() });
        if (existingBadge) {
            return res.status(400).json({ error: 'Badge with this name already exists' });
        }

        const badge = new Badge({
            name: name.trim(),
            icon: icon.trim(),
            points: parseInt(points),
            description: description?.trim()
        });

        await badge.save();

        res.status(201).json({
            message: 'Badge created successfully',
            badge
        });
    } catch (error) {
        console.error('Create badge error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all badges
// @route   GET /api/badges
// @access  Public
const getBadges = async (req, res) => {
    try {
        const badges = await Badge.find({})
            .select('-__v')
            .sort({ points: -1 }); // Highest points first

        res.json({
            badges
        });
    } catch (error) {
        console.error('Get badges error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get single badge
// @route   GET /api/badges/:id
// @access  Public
const getBadge = async (req, res) => {
    try {
        const badge = await Badge.findById(req.params.id).select('-__v');

        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        res.json({ badge });
    } catch (error) {
        console.error('Get badge error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid badge ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Update badge
// @route   PUT /api/badges/:id
// @access  Private (Admin only)
const updateBadge = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { name, icon, points, description } = req.body;

        const badge = await Badge.findById(req.params.id);

        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        // Check if new name conflicts with existing badge (excluding current one)
        if (name && name.trim() !== badge.name) {
            const existingBadge = await Badge.findOne({ name: name.trim() });
            if (existingBadge) {
                return res.status(400).json({ error: 'Badge with this name already exists' });
            }
        }

        // Update fields
        if (name !== undefined) badge.name = name.trim();
        if (icon !== undefined) badge.icon = icon.trim();
        if (points !== undefined) badge.points = parseInt(points);
        if (description !== undefined) badge.description = description?.trim();

        await badge.save();

        res.json({
            message: 'Badge updated successfully',
            badge
        });
    } catch (error) {
        console.error('Update badge error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid badge ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Delete badge
// @route   DELETE /api/badges/:id
// @access  Private (Admin only)
const deleteBadge = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const badge = await Badge.findById(req.params.id);

        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        // Remove badge from all students who have it
        await Student.updateMany(
            { badges: req.params.id },
            { $pull: { badges: req.params.id } }
        );

        await Badge.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Badge deleted successfully and removed from all students'
        });
    } catch (error) {
        console.error('Delete badge error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid badge ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Assign badge to student
// @route   POST /api/badges/:badgeId/assign/:studentId
// @access  Private (Admin/Teacher)
const assignBadgeToStudent = async (req, res) => {
    try {
        // Check if user is admin or teacher
        if (!['admin', 'teacher'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Admin or Teacher only.' });
        }

        const { badgeId, studentId } = req.params;

        // Check if badge exists
        const badge = await Badge.findById(badgeId);
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if student already has this badge
        if (student.badges && student.badges.includes(badgeId)) {
            return res.status(400).json({ error: 'Student already has this badge' });
        }

        // Add badge to student
        await Student.findByIdAndUpdate(
            studentId,
            { $addToSet: { badges: badgeId } }
        );

        res.json({
            message: `Badge "${badge.name}" assigned to ${student.name} successfully`
        });
    } catch (error) {
        console.error('Assign badge error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid badge or student ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Remove badge from student
// @route   DELETE /api/badges/:badgeId/remove/:studentId
// @access  Private (Admin/Teacher)
const removeBadgeFromStudent = async (req, res) => {
    try {
        // Check if user is admin or teacher
        if (!['admin', 'teacher'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Admin or Teacher only.' });
        }

        const { badgeId, studentId } = req.params;

        // Check if badge exists
        const badge = await Badge.findById(badgeId);
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if student has this badge
        if (!student.badges || !student.badges.includes(badgeId)) {
            return res.status(400).json({ error: 'Student does not have this badge' });
        }

        // Remove badge from student
        await Student.findByIdAndUpdate(
            studentId,
            { $pull: { badges: badgeId } }
        );

        res.json({
            message: `Badge "${badge.name}" removed from ${student.name} successfully`
        });
    } catch (error) {
        console.error('Remove badge error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid badge or student ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get student's badges
// @route   GET /api/badges/student/:studentId
// @access  Private (Student can view their own, Admin/Teacher can view any)
const getStudentBadges = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Check permissions
        if (req.user.role === 'student' && req.user.id !== studentId) {
            return res.status(403).json({ error: 'Access denied. Can only view your own badges.' });
        }

        const student = await Student.findById(studentId).populate('badges').select('name badges');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            student: {
                id: student._id,
                name: student.name,
                badges: student.badges
            }
        });
    } catch (error) {
        console.error('Get student badges error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid student ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createBadge,
    getBadges,
    getBadge,
    updateBadge,
    deleteBadge,
    assignBadgeToStudent,
    removeBadgeFromStudent,
    getStudentBadges
};