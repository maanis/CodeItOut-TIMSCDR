const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    responses: [{
        questionIndex: {
            type: Number,
            required: true
        },
        selectedOption: {
            type: String,
            required: false
        },
        isCorrect: {
            type: Boolean,
            required: true
        },
        pointsEarned: {
            type: Number,
            default: 0
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    timeTaken: {
        type: Number // in seconds
    }
});

// Index to prevent multiple attempts on the same quiz by the same student
quizAttemptSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);