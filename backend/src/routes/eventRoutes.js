const express = require('express');
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Teacher only)
router.post('/', createEvent);

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', getEvent);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Teacher only)
router.put('/:id', updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Teacher only)
router.delete('/:id', deleteEvent);

module.exports = router;