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
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
    },
    password: {
        type: String,
        // minlength: 6,
        default: null // Null for passwordless login
    },
    roll: {
        type: String,
        trim: true,
        uppercase: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    avatarUrl: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifiedAt: {
        type: Date,
        default: null
    },
    totalPoints: {
        type: Number,
        default: 0,
        min: 0
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
studentSchema.index({ username: 1 }, { unique: true });
studentSchema.index({ roll: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);