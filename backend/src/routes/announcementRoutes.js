const express = require('express');
const { createAnnouncement, getAnnouncements, getAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/announcements
// @desc    Create a new announcement
// @access  Private (Teacher only)
router.post('/', createAnnouncement);

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public
router.get('/', getAnnouncements);

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Public
router.get('/:id', getAnnouncement);

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (Teacher only)
router.put('/:id', updateAnnouncement);

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Teacher only)
router.delete('/:id', deleteAnnouncement);

module.exports = router;