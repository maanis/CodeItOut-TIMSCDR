require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const path = require('path');
const { logger, httpLogger } = require('./config/logger');

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

const app = express();

// Pino HTTP request logging middleware (should be one of the first)
app.use(httpLogger);

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

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});