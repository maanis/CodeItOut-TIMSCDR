const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin/Teacher)
const createEvent = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const event = new Event({
            title,
            description,
            status: status || 'Upcoming'
        });

        await event.save();

        // Create notifications for all students
        try {
            const students = await Student.find({}, '_id');
            const notifications = students.map(student => ({
                content: `New event: ${title}`,
                userId: student._id,
                type: 'event'
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (notificationError) {
            console.error('Error creating notifications:', notificationError);
            // Don't fail the event creation if notifications fail
        }

        res.status(201).json({
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({})
            .select('-__v')
            .sort({ createdAt: -1 }); // Latest first

        res.json({
            events
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .select('-__v');

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({
            event
        });
    } catch (error) {
        console.error('Get event error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/Teacher)
const updateEvent = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (status) event.status = status;

        await event.save();

        res.json({
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        console.error('Update event error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Teacher)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createEvent, getEvents, getEvent, updateEvent, deleteEvent };