const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean
    },
    githublink: {
        type: String,
        required: true,
        trim: true
    },
    liveLink: {
        type: String,
        trim: true
    },
    techStack: {
        type: [String],
        default: []
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
projectSchema.index({ student: 1 });
projectSchema.index({ approved: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);