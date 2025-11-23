const redis = require('../config/redis');
const Student = require('../models/Student');
const Badge = require('../models/Badge');
const Project = require('../models/Project');

const LEADERBOARD_KEY = 'leaderboard:students';
const LEADERBOARD_CACHE_TTL = 5 * 60; // 5 minutes cache per page

/**
 * Get leaderboard with pagination
 * @route GET /api/leaderboard
 * @query page - page number (default: 1)
 * @query limit - items per page (default: 10)
 * @returns Paginated leaderboard data with rank
 */
const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Create cache key with page and limit
        const cacheKey = `leaderboard:page:${page}:limit:${limit}`;

        // Try to get from cache first
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: JSON.parse(cachedData).data,
                pagination: JSON.parse(cachedData).pagination,
                cached: true
            });
        }

        // Get total count of leaderboard entries
        const totalCount = await redis.zcard(LEADERBOARD_KEY);

        if (totalCount === 0) {
            return res.json({
                success: true,
                data: [],
                pagination: {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: page,
                    limit: limit
                }
            });
        }

        // Calculate pagination
        const totalPages = Math.ceil(totalCount / limit);
        const skip = (page - 1) * limit;

        // Get students from Redis (sorted from highest to lowest score)
        // ZREVRANGE gets elements in reverse order (highest scores first)
        const leaderboardData = await redis.zrevrange(
            LEADERBOARD_KEY,
            skip,
            skip + limit - 1,
            'WITHSCORES'
        );

        // Parse the data and construct response with rank
        const leaderboard = [];
        for (let i = 0; i < leaderboardData.length; i += 2) {
            const studentId = leaderboardData[i];
            const score = leaderboardData[i + 1];

            // Get full student data from Redis hash
            const studentData = await redis.hgetall(`leaderboard:student:${studentId}`);

            console.log(studentData, 'sdgsdgshgdhsgdhsgdhsgdshg')

            if (studentData && Object.keys(studentData).length > 0) {
                leaderboard.push({
                    rank: skip + Math.floor(i / 2) + 1,
                    studentId: studentId,
                    name: studentData.name || 'Unknown',
                    email: studentData.email || '',
                    points: parseInt(score),
                    badgesCount: parseInt(studentData.badgesCount) || 0,
                    projectsCount: parseInt(studentData.projectsCount) || 0,
                    avatar: studentData.avatar || null
                });
            }
        }

        const responseData = {
            data: leaderboard,
            pagination: {
                totalItems: totalCount,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        };

        // Cache this page's result for 5 minutes
        await redis.setex(cacheKey, LEADERBOARD_CACHE_TTL, JSON.stringify(responseData));

        res.json({
            success: true,
            ...responseData,
            cached: false
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
};

/**
 * Update a specific student's leaderboard data
 * Called when student's points, badges, or projects change
 * @route POST /api/leaderboard/update/:studentId
 * @param studentId - Student ID to update
 */
const updateLeaderboard = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Fetch student from database
        const student = await Student.findById(studentId).select('name email totalPoints avatar');
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Count badges earned by student
        const badgesCount = await Badge.countDocuments({ earnedBy: studentId });

        // Count projects submitted by student
        const projectsCount = await Project.countDocuments({ studentId: studentId });

        // Update in Redis ZSET (sorted by points)
        await redis.zadd(LEADERBOARD_KEY, student.totalPoints || 0, studentId);

        // Store student data in Redis hash for quick access
        await redis.hset(`leaderboard:student:${studentId}`, 'name', student.name, 'email', student.email, 'badgesCount', badgesCount, 'projectsCount', projectsCount, 'avatar', student.avatarUrl || '');

        // Clear all page caches since leaderboard has changed
        const keys = await redis.keys('leaderboard:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }

        res.json({
            success: true,
            message: 'Leaderboard updated successfully',
            data: {
                studentId: studentId,
                name: student.name,
                points: student.totalPoints || 0,
                badgesCount: badgesCount,
                projectsCount: projectsCount
            }
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating leaderboard',
            error: error.message
        });
    }
};

/**
 * Rebuild entire leaderboard from database
 * Should be called once or when you need to sync data
 * @route POST /api/leaderboard/rebuild
 */
const rebuildLeaderboard = async (req, res) => {
    try {
        // Clear existing leaderboard data
        await redis.del(LEADERBOARD_KEY);

        // Clear all page caches
        const cacheKeys = await redis.keys('leaderboard:page:*');
        if (cacheKeys.length > 0) {
            await redis.del(...cacheKeys);
        }

        // Get all students with their data
        const students = await Student.find().select('_id name email totalPoints avatarUrl');

        if (students.length === 0) {
            return res.json({
                success: true,
                message: 'No students found to add to leaderboard',
                data: { addedCount: 0 }
            });
        }

        let addedCount = 0;

        console.log(students)

        // Process each student
        for (const student of students) {
            try {
                // Count badges and projects
                console.log(student.avatarUrl)
                const [badgesCount, projectsCount] = await Promise.all([
                    Badge.countDocuments({ earnedBy: student._id }),
                    Project.countDocuments({ studentId: student._id })
                ]);

                // Add to sorted set
                await redis.zadd(LEADERBOARD_KEY, student.totalPoints || 0, student._id.toString());

                // Store student data in hash
                await redis.hset(`leaderboard:student:${student._id.toString()}`, 'name', student.name, 'email', student.email, 'badgesCount', badgesCount, 'projectsCount', projectsCount, 'avatar', `http://localhost:5000/api${student.avatarUrl}` || '');

                addedCount++;
            } catch (studentError) {
                console.error(`Error processing student ${student._id}:`, studentError);
            }
        }

        res.json({
            success: true,
            message: 'Leaderboard rebuilt successfully',
            data: {
                totalStudents: students.length,
                addedCount: addedCount,
                failedCount: students.length - addedCount
            }
        });
    } catch (error) {
        console.error('Error rebuilding leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error rebuilding leaderboard',
            error: error.message
        });
    }
};

module.exports = {
    getLeaderboard,
    updateLeaderboard,
    rebuildLeaderboard
};
