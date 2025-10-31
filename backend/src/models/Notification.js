const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    hasRead: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    type: {
        type: String,
        enum: ['announcement', 'badge', 'project', 'event', 'system', 'quiz'],
        default: 'system'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, hasRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);