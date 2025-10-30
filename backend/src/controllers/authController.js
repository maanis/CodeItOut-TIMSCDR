const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Python face recognition API URL (adjust port as needed)
const FACE_API_URL = process.env.FACE_API_URL || 'http://localhost:8000';

// Helper function to extract face embeddings from image
const extractFaceEmbeddings = async (imagePath) => {
    try {
        const formData = new FormData();

        // Read image file
        const imageBuffer = fs.readFileSync(imagePath);
        formData.append('file', imageBuffer, {
            filename: 'face.jpg',
            contentType: 'image/jpeg'
        });

        const response = await axios.post(`${FACE_API_URL}/extract-embeddings/`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 30000, // 30 second timeout
        });

        console.log('FastApi res', response.data);

        if (response.data.success && response.data.embeddings) {
            return {
                success: true,
                embeddings: response.data.embeddings,
                dimensions: response.data.dimensions
            };
        } else {
            return {
                success: false,
                error: response.data.error || 'Face extraction failed'
            };
        }
    } catch (error) {
        console.error('Face extraction API error:', error.message);
        return {
            success: false,
            error: error.response?.data?.error || 'Face recognition service unavailable'
        };
    }
};

const register = async (req, res) => {
    try {
        let requestData;

        // Handle different content types
        if (req.headers['content-type'] === 'text/plain' && req.body) {
            try {
                requestData = JSON.parse(req.body);
            } catch (parseError) {
                return res.status(400).json({
                    error: 'Invalid JSON in request body',
                    details: 'Content-Type is text/plain but body is not valid JSON'
                });
            }
        } else if (req.headers['content-type']?.includes('application/json') || !req.headers['content-type']) {
            requestData = req.body;
        } else {
            return res.status(400).json({
                error: 'Unsupported Content-Type',
                supported: ['application/json', 'text/plain (with valid JSON)']
            });
        }

        const { name, email, password } = requestData;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Missing required fields: name, email, password',
                received: requestData
            });
        }

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new teacher
        const teacher = new Teacher({
            name,
            email,
            password: hashedPassword
        });

        await teacher.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: teacher._id, email: teacher.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            message: 'Teacher registered successfully',
            token,
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const registerStudent = async (req, res) => {
    try {
        const { name, roll, email, password } = req.body;

        // Validate required fields
        if (!name || !roll || !email || !password) {
            return res.status(400).json({ error: 'Name, roll number, email, and password are required' });
        }

        // Check if image file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Profile image is required for face recognition' });
        }

        // Check if student already exists by email
        const existingStudentByEmail = await Student.findOne({ email });
        if (existingStudentByEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if student already exists by roll number
        const existingStudentByRoll = await Student.findOne({ roll: roll.toUpperCase() });
        if (existingStudentByRoll) {
            return res.status(400).json({ error: 'Roll number already registered' });
        }

        // Extract face embeddings from uploaded image
        const faceResult = await extractFaceEmbeddings(req.file.path);
        if (!faceResult.success) {
            // Clean up uploaded file if face extraction fails
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ error: faceResult.error });
        }

        // Generate unique filename for avatar
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const avatarFilename = `student-${uniqueSuffix}${path.extname(req.file.originalname)}`;
        const avatarPath = path.join(__dirname, '../../uploads', avatarFilename);

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Move uploaded file to uploads folder
        try {
            fs.renameSync(req.file.path, avatarPath);
        } catch (error) {
            console.error('Error moving avatar file:', error);
            // Clean up temp file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({ error: 'Failed to save avatar image' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student with face embeddings and avatar URL
        const student = new Student({
            name: name.trim(),
            roll: roll.toUpperCase().trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            faceEmbeddings: faceResult.embeddings,
            avatarUrl: `/uploads/${avatarFilename}`
        });

        await student.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: student._id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            message: 'Student registered successfully',
            token,
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email,
                badges: student.badges || [],
                projects: student.approvedProjects || [],
                avatarUrl: student.avatarUrl,
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0
            }
        });
    } catch (error) {
        console.error('Student registration error:', error);
        // Clean up uploaded file in case of error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Determine user type and role
        let user;
        let role;

        // First check if it's a teacher (admin or regular teacher)
        user = await Teacher.findOne({ email });
        if (user) {
            // It's a teacher - check if admin
            role = email.toLowerCase().includes('admin') ? 'admin' : 'teacher';
        } else {
            // Check student collection with populated badges
            user = await Student.findOne({ email }).populate('badges', 'name icon points');
            if (user) {
                role = 'student';
            }
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with correct role
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        console.log('Login successful:', { token, user });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                avatarUrl: user.avatarUrl,
                email: user.email,
                badges: user.badges || [],
                projects: user.approvedProjects || [],
                role: role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const isAuthenticated = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.json({ authenticated: false });
        }

        const token = authHeader.split(" ")[1]; // "Bearer <token>"

        if (!token) {
            return res.json({ authenticated: false });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if it's a teacher
            let user = await Teacher.findById(decoded.id);
            let userType = 'teacher';

            if (!user) {
                // Check if it's a student
                user = await Student.findById(decoded.id).populate('badges', 'name icon points description');
                userType = 'student';
            }

            if (!user) {
                return res.json({ authenticated: false });
            }

            res.json({
                authenticated: true,
                [userType]: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    ...(userType === 'student' && {
                        roll: user.roll,
                        badges: user.badges || [],
                        avatarUrl: user.avatarUrl,
                        hasFaceEmbeddings: user.faceEmbeddings && user.faceEmbeddings.length > 0
                    })
                }
            });
        } catch (error) {
            return res.json({ authenticated: false });
        }
    } catch (error) {
        console.error('Authentication check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, registerStudent, login, logout, isAuthenticated };