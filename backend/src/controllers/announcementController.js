const Announcement = require('../models/Announcement');

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private (Admin/Teacher)
const createAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const announcement = new Announcement({
            title,
            content
        });

        await announcement.save();

        res.status(201).json({
            message: 'Announcement created successfully',
            announcement
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({})
            .select('-__v')
            .sort({ createdAt: -1 }); // Latest first

        res.json({
            announcements
        });
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .select('-__v');

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json({
            announcement
        });
    } catch (error) {
        console.error('Get announcement error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid announcement ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin/Teacher)
const updateAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;

        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        if (title) announcement.title = title;
        if (content) announcement.content = content;

        await announcement.save();

        res.json({
            message: 'Announcement updated successfully',
            announcement
        });
    } catch (error) {
        console.error('Update announcement error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid announcement ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin/Teacher)
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        await Announcement.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        console.error('Delete announcement error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid announcement ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createAnnouncement, getAnnouncements, getAnnouncement, updateAnnouncement, deleteAnnouncement };