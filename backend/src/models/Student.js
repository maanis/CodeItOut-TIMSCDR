const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    roll: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    avatarUrl: {
        type: String,
        default: null
    },
    badges: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Badge',
        default: []
    },
    approvedProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Project',
        default: []
    },
    inCommunity: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
studentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Index for faster queries
studentSchema.index({ name: 1 });
studentSchema.index({ roll: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);