# CodeItOut Backend

A comprehensive backend API for the CodeItOut educational platform, built with Node.js/Express and Python/FastAPI. This backend supports student management, quiz systems, face recognition, project tracking, and various educational features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Student Management**: Complete CRUD operations for student profiles
- **Quiz System**: Create, manage, and track quiz attempts with scoring
- **Face Recognition**: AI-powered face recognition using FaceNet and MTCNN
- **Project Management**: Track student projects and submissions
- **Event Management**: Schedule and manage educational events
- **Announcement System**: Broadcast important notices to students
- **Badge System**: Gamification with achievement badges
- **Notification System**: Real-time notifications for users
- **File Upload**: Secure file upload handling with Multer
- **Session Management**: Track user sessions and activity

## 🛠 Tech Stack

### Backend (Node.js)

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **File Handling**: Multer for multipart uploads
- **CORS**: Configurable CORS policy
- **Development**: Nodemon for hot reloading

### AI/ML (Python)

- **Framework**: FastAPI
- **Face Recognition**: FaceNet-PyTorch, MTCNN
- **Computer Vision**: OpenCV, Pillow, scikit-image
- **Deep Learning**: PyTorch
- **Image Processing**: NumPy, SciPy

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection configuration
│   │   └── multer.js          # File upload configuration
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── studentsController.js
│   │   ├── announcementController.js
│   │   ├── badgeController.js
│   │   ├── eventController.js
│   │   ├── notificationController.js
│   │   ├── projectController.js
│   │   └── sessionController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── uploadMiddleware.js # File upload middleware
│   ├── models/                # Mongoose schemas
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Quiz.js
│   │   ├── QuizAttempt.js
│   │   ├── Announcement.js
│   │   ├── Event.js
│   │   ├── Project.js
│   │   ├── Badge.js
│   │   ├── Notification.js
│   │   └── Session.js
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── studentsRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── badgeRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── healthRoutes.js
│   └── index.js               # Main application entry point
├── uploads/                   # File upload directory
├── app.py                     # FastAPI face recognition service
├── requirements.txt           # Python dependencies
├── package.json               # Node.js dependencies and scripts
├── .env                       # Environment variables
├── start_face_api.bat         # Windows batch script for face API
└── seedBadges.js              # Database seeding script
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/codeItOutHackathon
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
```

### 5. Start MongoDB

Ensure MongoDB is running on your system or update the `MONGO_URI` to point to your MongoDB instance.

### 6. Start the Services

#### Start the Node.js Backend

```bash
npm run dev
```

#### Start the Face Recognition API (Python)

```bash
# Option 1: Using Python directly
python app.py

# Option 2: Using the batch script (Windows)
./start_face_api.bat
```

The Node.js server will run on `http://localhost:5000` and the FastAPI service on `http://localhost:8000`.

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Quiz System

- `GET /api/quiz` - Get all quizzes
- `POST /api/quiz` - Create new quiz
- `GET /api/quiz/:id` - Get quiz by ID
- `PUT /api/quiz/:id` - Update quiz
- `DELETE /api/quiz/:id` - Delete quiz
- `POST /api/quiz/:id/submit` - Submit quiz attempt

### Face Recognition

- `POST /api/face/recognize` - Recognize face from image
- `POST /api/face/register` - Register new face

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event

### Announcements

- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create new announcement
- `GET /api/announcements/:id` - Get announcement by ID

### Badges

- `GET /api/badges` - Get all badges
- `POST /api/badges` - Create new badge
- `GET /api/badges/:id` - Get badge by ID

### Notifications

- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark notification as read

### File Upload

- `POST /api/upload` - Upload files

### Health Check

- `GET /api/health` - API health status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### Student

- Personal information (name, email, etc.)
- Academic details
- Face embeddings for recognition
- Project associations
- Badge collections

### Quiz

- Questions with multiple choice options
- Scoring system
- Time limits
- Attempt tracking

### Project

- Project details and descriptions
- Student assignments
- Submission tracking
- Evaluation scores

### Event

- Event scheduling
- Participant management
- Event categories

### Badge

- Achievement system
- Gamification features
- Progress tracking

## 🚀 Deployment

### Production Considerations

1. Set secure environment variables
2. Configure MongoDB for production
3. Set up proper CORS origins
4. Implement rate limiting
5. Add request logging
6. Set up monitoring and alerts

### Docker Support

Add Dockerfile and docker-compose.yml for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 API Versioning

Current API version: v1
Base URL: `/api`

All endpoints are prefixed with `/api` and follow RESTful conventions.</content>
<filePath">c:\Users\Asus TUF\Desktop\code it out\backend\README.md
