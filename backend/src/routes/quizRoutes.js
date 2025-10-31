const express = require('express');
const {
    createQuiz,
    getQuizzes,
    getQuiz,
    startQuizAttempt,
    submitQuiz,
    getMyAttempts,
    getAllAttempts,
    getQuizAttempts,
    getMyQuizAttempt,
    startQuiz,
    stopQuiz
} = require('../controllers/quizController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (Admin/Teacher)
router.post('/', auth, createQuiz);

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Public
router.get('/', getQuizzes);

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID
// @access  Public
router.get('/:id', getQuiz);

// @route   PUT /api/quizzes/:id/start
// @desc    Start quiz
// @access  Private (Admin/Teacher)
router.put('/:id/start', auth, startQuiz);

// @route   PUT /api/quizzes/:id/stop
// @desc    Stop quiz
// @access  Private (Admin/Teacher)
router.put('/:id/stop', auth, stopQuiz);

// @route   POST /api/quizzes/:id/attempt
// @desc    Start quiz attempt
// @access  Private (Student)
router.post('/:id/attempt', auth, startQuizAttempt);

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private (Student)
router.post('/:id/submit', auth, submitQuiz);

// @route   GET /api/quizzes/my-attempts
// @desc    Get student's quiz attempts
// @access  Private (Student)
router.get('/my-attempts', auth, getMyAttempts);

// @route   GET /api/quizzes/:id/attempts
// @desc    Get attempts for a specific quiz (Leaderboard)
// @access  Public (for completed quizzes)
router.get('/:id/attempts', getQuizAttempts);

// @route   GET /api/quizzes/:id/my-attempt
// @desc    Get student's attempt for a specific quiz
// @access  Private (Student)
router.get('/:id/my-attempt', auth, getMyQuizAttempt);

module.exports = router;