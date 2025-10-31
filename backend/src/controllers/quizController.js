const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Admin/Teacher)
const createQuiz = async (req, res) => {
    try {
        const { title, description, questions, timer } = req.body;

        if (!title || !description || !questions || !timer) {
            return res.status(400).json({ error: 'Title, description, questions, and timer are required' });
        }

        // Validate questions structure
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText || !q.options || !q.correctAnswer) {
                return res.status(400).json({ error: `Question ${i + 1} is missing required fields` });
            }
            if (!q.options.includes(q.correctAnswer)) {
                return res.status(400).json({ error: `Question ${i + 1}: correct answer must be one of the options` });
            }
        }

        const quiz = new Quiz({
            title,
            description,
            questions,
            timer,
            createdBy: req.user.id
        });

        await quiz.save();

        // Create notifications for all students
        try {
            const students = await Student.find({}, '_id');
            const notifications = students.map(student => ({
                content: `New quiz available: ${title}`,
                userId: student._id,
                type: 'quiz'
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (notificationError) {
            console.error('Error creating notifications:', notificationError);
        }

        res.status(201).json({
            message: 'Quiz created successfully',
            quiz
        });
    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Get quiz error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Start quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private (Student)
const startQuizAttempt = async (req, res) => {
    try {
        console.log('Start quiz attempt request:', { quizId: req.params.id, userId: req.user?.id });

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Check if student already attempted this quiz
        const existingAttempt = await QuizAttempt.findOne({
            quizId: new mongoose.Types.ObjectId(req.params.id),
            studentId: new mongoose.Types.ObjectId(req.user.id)
        });

        if (existingAttempt) {
            console.log('Existing attempt found:', existingAttempt._id);
            return res.status(400).json({ error: 'You have already attempted this quiz' });
        }

        // Create new attempt
        const attempt = new QuizAttempt({
            quizId: new mongoose.Types.ObjectId(req.params.id),
            studentId: new mongoose.Types.ObjectId(req.user.id),
            responses: []
        });

        await attempt.save();
        console.log('New attempt created:', attempt._id);

        res.json({
            message: 'Quiz attempt started',
            attempt: {
                _id: attempt._id,
                quizId: attempt.quizId,
                startedAt: attempt.startedAt
            },
            quiz: {
                _id: quiz._id,
                title: quiz.title,
                description: quiz.description,
                questions: quiz.questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options,
                    points: q.points
                })),
                timer: quiz.timer
            }
        });
    } catch (error) {
        console.error('Start quiz attempt error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student)
const submitQuiz = async (req, res) => {
    try {
        const { responses } = req.body;
        console.log('Submit quiz request:', { quizId: req.params.id, studentId: req.user.id, responses });

        if (!responses || !Array.isArray(responses)) {
            return res.status(400).json({ error: 'Responses array is required' });
        }

        const quiz = await Quiz.findById(req.params.id);
        console.log('Found quiz:', quiz ? quiz._id : 'not found');

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Find the quiz attempt
        const attempt = await QuizAttempt.findOne({
            quizId: new mongoose.Types.ObjectId(req.params.id),
            studentId: new mongoose.Types.ObjectId(req.user.id)
        });
        console.log('Found attempt:', attempt ? attempt._id : 'not found');

        if (!attempt) {
            return res.status(404).json({ error: 'Quiz attempt not found. Please start the quiz first.' });
        }

        if (attempt.completedAt) {
            return res.status(400).json({ error: 'Quiz already completed' });
        }

        // Calculate score
        let totalScore = 0;
        const processedResponses = responses.map((response, index) => {
            const question = quiz.questions[index];
            if (!question) {
                console.log(`No question found for index ${index}`);
                return {
                    questionIndex: index,
                    selectedOption: response.selectedOption || '',
                    isCorrect: false,
                    pointsEarned: 0
                };
            }

            const isCorrect = response.selectedOption && response.selectedOption.trim() !== '' && response.selectedOption === question.correctAnswer;
            const pointsEarned = isCorrect ? (question.points || 1) : 0;

            console.log(`Question ${index}: selected="${response.selectedOption || '(unanswered)'}", correct="${question.correctAnswer}", isCorrect=${isCorrect}, points=${pointsEarned}`);

            totalScore += pointsEarned;

            return {
                questionIndex: index,
                selectedOption: response.selectedOption && response.selectedOption.trim() !== '' ? response.selectedOption : null,
                isCorrect,
                pointsEarned
            };
        });

        console.log('Total calculated score:', totalScore);

        // Update attempt
        attempt.responses = processedResponses;
        attempt.totalScore = totalScore;
        attempt.completedAt = new Date();
        attempt.timeTaken = Math.floor((attempt.completedAt - attempt.startedAt) / 1000); // in seconds

        try {
            await attempt.save();
            console.log('Attempt saved successfully');
        } catch (saveError) {
            console.error('Error saving attempt:', saveError);
            return res.status(500).json({ error: 'Failed to save quiz attempt' });
        }

        res.json({
            message: 'Quiz submitted successfully',
            result: {
                totalScore,
                maxScore: quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0),
                timeTaken: attempt.timeTaken,
                responses: processedResponses
            }
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get quiz attempts for a student
// @route   GET /api/quizzes/my-attempts
// @access  Private (Student)
const getMyAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ studentId: req.user.id })
            .populate('quizId', 'title description createdAt')
            .sort({ completedAt: -1 });

        res.json(attempts);
    } catch (error) {
        console.error('Get my attempts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all quiz attempts (Admin)
// @route   GET /api/quizzes/admin/attempts
// @access  Private (Admin)
const getAllAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find()
            .populate('quizId', 'title')
            .populate('studentId', 'name email')
            .sort({ completedAt: -1 });

        res.json(attempts);
    } catch (error) {
        console.error('Get all attempts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get attempts for a specific quiz (Leaderboard)
// @route   GET /api/quizzes/:id/attempts
// @access  Public (for completed quizzes)
const getQuizAttempts = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Only allow access to completed quizzes for leaderboard
        if (quiz.status !== 'completed') {
            return res.status(403).json({ error: 'Leaderboard is only available for completed quizzes' });
        }

        const attempts = await QuizAttempt.find({ quizId: req.params.id })
            .populate('studentId', 'name email')
            .sort({ totalScore: -1, timeTaken: 1 }); // Sort by score desc, then time asc

        // Calculate max possible score
        const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

        // Format leaderboard data
        const leaderboard = attempts.map((attempt, index) => ({
            rank: index + 1,
            studentId: attempt.studentId._id,
            studentName: attempt.studentId.name,
            score: Math.round((attempt.totalScore / maxScore) * 100),
            totalScore: attempt.totalScore,
            maxScore,
            correctAnswers: attempt.responses.filter(r => r.isCorrect).length,
            wrongAnswers: attempt.responses.filter(r => !r.isCorrect).length,
            timeTaken: Math.floor(attempt.timeTaken / 60), // Convert to minutes
            completedAt: attempt.completedAt
        }));

        res.json({
            quiz: {
                _id: quiz._id,
                title: quiz.title,
                totalQuestions: quiz.questions.length,
                maxScore
            },
            leaderboard
        });
    } catch (error) {
        console.error('Get quiz attempts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get student's attempt for a specific quiz
// @route   GET /api/quizzes/:id/my-attempt
// @access  Private (Student)
const getMyQuizAttempt = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const attempt = await QuizAttempt.findOne({
            quizId: new mongoose.Types.ObjectId(req.params.id),
            studentId: new mongoose.Types.ObjectId(req.user.id)
        });

        if (!attempt) {
            return res.status(404).json({ error: 'You have not attempted this quiz yet' });
        }

        // Calculate max possible score
        const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
        const scorePercentage = Math.round((attempt.totalScore / maxScore) * 100);

        // Get leaderboard rank
        const allAttempts = await QuizAttempt.find({ quizId: req.params.id })
            .sort({ totalScore: -1, timeTaken: 1 });

        const rank = allAttempts.findIndex(a => a._id.toString() === attempt._id.toString()) + 1;

        res.json({
            attempt: {
                _id: attempt._id,
                score: scorePercentage,
                totalScore: attempt.totalScore,
                maxScore,
                correctAnswers: attempt.responses.filter(r => r.isCorrect).length,
                wrongAnswers: attempt.responses.filter(r => !r.isCorrect).length,
                timeTaken: Math.floor(attempt.timeTaken / 60), // Convert to minutes
                rank,
                submittedAt: attempt.completedAt,
                responses: attempt.responses
            },
            quiz: {
                _id: quiz._id,
                title: quiz.title,
                totalQuestions: quiz.questions.length
            }
        });
    } catch (error) {
        console.error('Get my quiz attempt error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Start quiz
// @route   PUT /api/quizzes/:id/start
// @access  Private (Admin/Teacher)
const startQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        if (quiz.status !== 'upcoming') {
            return res.status(400).json({ error: 'Quiz can only be started if it is upcoming' });
        }

        quiz.status = 'ongoing';
        quiz.startedAt = new Date();
        await quiz.save();

        res.json({
            message: 'Quiz started successfully',
            quiz
        });
    } catch (error) {
        console.error('Start quiz error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Stop quiz
// @route   PUT /api/quizzes/:id/stop
// @access  Private (Admin/Teacher)
const stopQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        if (quiz.status !== 'ongoing') {
            return res.status(400).json({ error: 'Quiz can only be stopped if it is ongoing' });
        }

        quiz.status = 'completed';
        quiz.endedAt = new Date();
        await quiz.save();

        res.json({
            message: 'Quiz stopped successfully',
            quiz
        });
    } catch (error) {
        console.error('Stop quiz error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
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
};