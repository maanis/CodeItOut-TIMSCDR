const Student = require('../models/Student');
const Notification = require('../models/Notification');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const redis = require('../config/redis');

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

// Create a new student
const createStudent = async (req, res) => {
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student with face embeddings
        const student = new Student({
            name: name.trim(),
            roll: roll.toUpperCase().trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            faceEmbeddings: faceResult.embeddings
        });

        await student.save();

        // Clean up uploaded file after successful processing
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            message: 'Student created successfully',
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email,
                projects: student.approvedProjects || [],
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0,
                createdAt: student.createdAt
            }
        });
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        let query = {};

        // Add search functionality
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { roll: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const students = await Student.find(query)
            .select('-__v')
            .populate('badges', 'name icon points')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Student.countDocuments(query);

        res.json({
            students: students.map(student => ({
                id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email,
                avatarUrl: student.avatarUrl,
                badges: student.badges,
                projects: student.approvedProjects || [],
                inCommunity: student.inCommunity,
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalStudents: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get student by ID
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id).select('-__v').populate('badges', 'name icon points');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email,
                avatarUrl: student.avatarUrl,
                badges: student.badges,
                projects: student.approvedProjects || [],
                inCommunity: student.inCommunity,
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            }
        });
    } catch (error) {
        console.error('Get student by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get student by roll number
const getStudentByRoll = async (req, res) => {
    try {
        const { roll } = req.params;

        const student = await Student.findOne({ roll: roll.toUpperCase() }).select('-__v').populate('badges', 'name icon points');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email,
                avatarUrl: student.avatarUrl,
                badges: student.badges,
                projects: student.approvedProjects || [],
                inCommunity: student.inCommunity,
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            }
        });
    } catch (error) {
        console.error('Get student by roll error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update student
const updateStudent = async (req, res) => {
    let uploadedFilePath = null;

    try {
        const { id } = req.params;
        const { name, roll } = req.body;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (roll) updateData.roll = roll.toUpperCase().trim();

        // Check if roll number is being changed and if it already exists
        if (roll) {
            const existingStudent = await Student.findOne({
                roll: roll.toUpperCase().trim(),
                _id: { $ne: id }
            });
            if (existingStudent) {
                return res.status(400).json({
                    error: 'Student with this roll number already exists'
                });
            }
        }

        // Handle image upload and face extraction
        if (req.file) {
            uploadedFilePath = req.file.path;

            console.log('Processing uploaded image for face recognition update...');

            const faceResult = await extractFaceEmbeddings(uploadedFilePath);

            if (faceResult.success) {
                updateData.faceEmbeddings = faceResult.embeddings;
                updateData.profileImage = `/uploads/${req.file.filename}`;
                console.log(`Face embeddings updated: ${faceResult.dimensions} dimensions`);
            } else {
                // Check if the error is specifically about no face detected
                if (faceResult.error && faceResult.error.includes('No face detected')) {
                    console.error('Face detection failed during update:', faceResult.error);
                    return res.status(400).json({
                        error: 'No face detected in the uploaded image. Please upload a clear photo of your face.',
                        details: faceResult.error
                    });
                } else {
                    // For other types of errors (API unavailable, etc.), still allow student update
                    console.warn('Face extraction failed during update (non-critical):', faceResult.error);
                    // Student can still be updated without changing face embeddings
                }
            }
        }

        const student = await Student.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            message: 'Student updated successfully',
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                projects: student.approvedProjects || [],
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0,
                profileImage: student.profileImage,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            }
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Clean up uploaded file
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            try {
                fs.unlinkSync(uploadedFilePath);
                console.log('Cleaned up uploaded file:', uploadedFilePath);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            message: 'Student deleted successfully',
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll
            }
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update face embeddings for a student
const updateFaceEmbeddings = async (req, res) => {
    try {
        const { id } = req.params;
        const { faceEmbeddings } = req.body;

        if (!faceEmbeddings || !Array.isArray(faceEmbeddings)) {
            return res.status(400).json({
                error: 'Face embeddings must be an array of numbers'
            });
        }

        const student = await Student.findByIdAndUpdate(
            id,
            {
                faceEmbeddings: faceEmbeddings,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-__v');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            message: 'Face embeddings updated successfully',
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                hasFaceEmbeddings: student.faceEmbeddings && student.faceEmbeddings.length > 0,
                updatedAt: student.updatedAt
            }
        });
    } catch (error) {
        console.error('Update face embeddings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add student to community
const addToCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndUpdate(
            id,
            { inCommunity: true, updatedAt: new Date() },
            { new: true }
        ).select('-__v');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create notification for community addition
        try {
            await Notification.create({
                content: 'Welcome! You have been added to the coding community.',
                userId: id,
                type: 'system'
            });
        } catch (notificationError) {
            console.error('Error creating community addition notification:', notificationError);
        }

        res.json({
            message: 'Student added to community successfully',
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                inCommunity: student.inCommunity
            }
        });
    } catch (error) {
        console.error('Add to community error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove student from community
const removeFromCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndUpdate(
            id,
            { inCommunity: false, updatedAt: new Date() },
            { new: true }
        ).select('-__v');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create notification for community removal
        try {
            await Notification.create({
                content: 'You have been removed from the coding community.',
                userId: id,
                type: 'system'
            });
        } catch (notificationError) {
            console.error('Error creating community removal notification:', notificationError);
        }

        res.json({
            message: 'Student removed from community successfully',
            student: {
                id: student._id,
                name: student.name,
                roll: student.roll,
                inCommunity: student.inCommunity
            }
        });
    } catch (error) {
        console.error('Remove from community error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get current student's profile with rank and badges
 * Rank is fetched from Redis leaderboard, falls back to computed rank if needed
 * @route GET /api/students/profile/my-profile
 * @access Private (requires authentication)
 */
const getMyProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Fetch student with badges
        const student = await Student.findById(studentId)
            .populate({
                path: 'badges',
                select: 'name icon points description'
            })
            .select('name email totalPoints avatarUrl badges');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        let rank = null;

        // Try to get rank from Redis leaderboard
        try {
            const LEADERBOARD_KEY = 'leaderboard:students';

            // Get rank using ZREVRANK (0-indexed, highest score is rank 0)
            const redisRank = await redis.zrevrank(LEADERBOARD_KEY, studentId);

            if (redisRank !== null && redisRank !== undefined) {
                rank = redisRank + 1; // Convert to 1-indexed
            }
        } catch (redisError) {
            console.error('Error fetching rank from Redis:', redisError);
            // Continue to compute rank if Redis fails
        }

        // If rank not found in Redis, compute it optimally
        if (rank === null) {
            try {
                // Count students with more points than current student
                const studentsWithMorePoints = await Student.countDocuments({
                    totalPoints: { $gt: student.totalPoints }
                });
                rank = studentsWithMorePoints + 1;
            } catch (dbError) {
                console.error('Error computing rank from database:', dbError);
                rank = 0; // Fallback if both methods fail
            }
        }

        const profileData = {
            id: student._id,
            name: student.name,
            email: student.email,
            totalPoints: student.totalPoints || 0,
            rank: rank,
            badgesCount: student.badges.length,
            badges: student.badges.map(badge => ({
                id: badge._id,
                name: badge.name,
                icon: badge.icon,
                points: badge.points,
                description: badge.description
            })),
            avatar: student.avatarUrl || null
        };

        res.status(200).json({
            success: true,
            data: profileData
        });

    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentByRoll,
    updateStudent,
    deleteStudent,
    updateFaceEmbeddings,
    addToCommunity,
    removeFromCommunity,
    getMyProfile
};