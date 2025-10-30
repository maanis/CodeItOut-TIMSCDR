const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    icon: {
        type: String,
        required: true,
        trim: true
    },
    points: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        trim: true
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
badgeSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Index for faster queries
badgeSchema.index({ name: 1 });
badgeSchema.index({ points: -1 });

module.exports = mongoose.model('Badge', badgeSchema);