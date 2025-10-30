const express = require('express');
const {
    createBadge,
    getBadges,
    getBadge,
    updateBadge,
    deleteBadge,
    assignBadgeToStudent,
    removeBadgeFromStudent,
    getStudentBadges
} = require('../controllers/badgeController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/badges
// @desc    Create a new badge
// @access  Private (Admin only)
router.post('/', auth, createBadge);

// @route   GET /api/badges
// @desc    Get all badges
// @access  Public
router.get('/', getBadges);

// @route   GET /api/badges/:id
// @desc    Get single badge
// @access  Public
router.get('/:id', getBadge);

// @route   PUT /api/badges/:id
// @desc    Update badge
// @access  Private (Admin only)
router.put('/:id', auth, updateBadge);

// @route   DELETE /api/badges/:id
// @desc    Delete badge
// @access  Private (Admin only)
router.delete('/:id', auth, deleteBadge);

// @route   POST /api/badges/:badgeId/assign/:studentId
// @desc    Assign badge to student
// @access  Private (Admin/Teacher)
router.post('/:badgeId/assign/:studentId', auth, assignBadgeToStudent);

// @route   DELETE /api/badges/:badgeId/remove/:studentId
// @desc    Remove badge from student
// @access  Private (Admin/Teacher)
router.delete('/:badgeId/remove/:studentId', auth, removeBadgeFromStudent);

// @route   GET /api/badges/student/:studentId
// @desc    Get student's badges
// @access  Private (Student can view their own, Admin/Teacher can view any)
router.get('/student/:studentId', auth, getStudentBadges);

module.exports = router;