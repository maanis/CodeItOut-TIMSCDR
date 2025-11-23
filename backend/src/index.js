require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const redis = require('./config/redis');
const path = require('path');
const { logger, httpLogger } = require('./config/logger');
const { initializeEmailService } = require('./config/emailService');

// Import models to register them with Mongoose
require('./models/Student');
require('./models/Teacher');
require('./models/Quiz');
require('./models/QuizAttempt');
require('./models/Announcement');
require('./models/Event');
require('./models/Project');
require('./models/Badge');
require('./models/Notification');
require('./models/Session');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const projectRoutes = require('./routes/projectRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const quizRoutes = require('./routes/quizRoutes');
const logsRoutes = require('./routes/logsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const { rebuildLeaderboard } = require('./controllers/leaderboardController');

const app = express();

// Pino HTTP request logging middleware (should be one of the first)
// app.use(httpLogger);

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.text({ limit: '10mb' }));
const allowedOrigins = [
    /^https?:\/\/localhost(:\d+)?$/,    // ✅ any localhost port
    /\.vercel\.app$/,                   // ✅ any vercel.app subdomain
    /\.ngrok-free\.app$/,               // ✅ any ngrok-free.app subdomain
    "https://attend-ex.web.app",
    "https://93f2d792a542.ngrok-free.app"
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => (typeof o === "string" ? o === origin : o.test(origin)))) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    credentials: true,
}));

app.use(cookieParser());

// Serve static files from uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/contests', quizRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Initialize email service
initializeEmailService();

// Connect to DB
connectDB();

// Initialize leaderboard on startup
const initializeLeaderboard = async () => {
    try {
        const redisLeaderboardCount = await redis.zcard('leaderboard:students');
        if (redisLeaderboardCount === 0) {
            logger.info('Leaderboard is empty, rebuilding from database...');
            // We need to use the rebuildLeaderboard controller logic
            const Student = require('./models/Student');
            const Badge = require('./models/Badge');
            const Project = require('./models/Project');

            const students = await Student.find().select('_id name email totalPoints avatarUrl');

            if (students.length > 0) {
                for (const student of students) {
                    try {
                        const [badgesCount, projectsCount] = await Promise.all([
                            Badge.countDocuments({ earnedBy: student._id }),
                            Project.countDocuments({ studentId: student._id })
                        ]);

                        await redis.zadd('leaderboard:students', student.totalPoints || 0, student._id.toString());
                        await redis.hset(`leaderboard:student:${student._id.toString()}`, 'name', student.name, 'email', student.email, 'badgesCount', badgesCount, 'projectsCount', projectsCount, 'avatar', student.avatarUrl || '');
                    } catch (err) {
                        logger.error(`Error initializing student ${student._id}:`, err);
                    }
                }
                logger.info(`Leaderboard initialized with ${students.length} students`);
            }
        }
    } catch (error) {
        logger.error('Error initializing leaderboard:', error);
    }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    logger.info(`Server running on port ${PORT}`);
    // Initialize leaderboard after server starts and DB is connected
    await initializeLeaderboard();
});