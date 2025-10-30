const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Student)
const createProject = async (req, res) => {
    try {
        const { title, description, githublink, liveLink, techStack } = req.body;

        if (!title || !description || !githublink) {
            return res.status(400).json({ error: 'Title, description, and GitHub link are required' });
        }

        // Get student ID from authenticated user
        const studentId = req.user.id;

        const project = new Project({
            title,
            description,
            githublink,
            liveLink,
            techStack: techStack || [],
            student: studentId
        });

        await project.save();

        // Populate student info in response
        await project.populate('student', 'name roll email');

        res.status(201).json({
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public (for viewing approved projects), Private (for admin to see all)
const getProjects = async (req, res) => {
    try {
        const { approved, student } = req.query;
        let filter = {};

        // If not admin/teacher, only show approved projects
        // Admin/Teacher users see ALL projects by default
        // if (!req.user || (req.user.role !== 'teacher' && req.user.role !== 'admin')) {
        //     filter.approved = true;
        // }
        // // If approved query param is provided, apply the filter regardless of role
        // if (approved !== undefined) {
        //     filter.approved = approved === 'true';
        // }

        if (student) {
            filter.student = student;
        }

        const projects = await Project.find(filter)
            .populate('student', 'name roll email')
            .select('-__v')
            .sort({ createdAt: -1 }); // Latest first

        res.json({
            projects,
            count: projects.length
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public (for approved projects), Private (for own projects or admin)
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('student', 'name roll email')
            .select('-__v');

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if user can view this project
        const canView = project.approved ||
            (req.user && (req.user.id === project.student._id.toString() ||
                req.user.role === 'teacher' ||
                req.user.role === 'admin'));

        if (!canView) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({
            project
        });
    } catch (error) {
        console.error('Get project error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid project ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Student can update own projects, Admin/Teacher can update any)
const updateProject = async (req, res) => {
    try {
        const { title, description, githublink, liveLink, approved, techStack } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check permissions
        const canUpdate = req.user.id === project.student.toString() ||
            req.user.role === 'teacher' ||
            req.user.role === 'admin';

        if (!canUpdate) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Only admin/teacher can change approval status
        if (approved !== undefined && (req.user.role !== 'teacher' && req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Only teachers/admins can approve projects' });
        }

        if (title) project.title = title;
        if (description) project.description = description;
        if (githublink) project.githublink = githublink;
        if (liveLink !== undefined) project.liveLink = liveLink;
        if (techStack !== undefined) project.techStack = techStack;

        // Handle approval status change
        if (approved !== undefined) {
            const previousApprovalStatus = project.approved;
            project.approved = approved;

            // If approval status changed, update student's approvedProjects array
            if (approved !== previousApprovalStatus) {
                const Student = require('../models/Student');

                if (approved) {
                    // Add project to student's approvedProjects
                    await Student.findByIdAndUpdate(
                        project.student,
                        { $addToSet: { approvedProjects: project._id } }
                    );
                } else {
                    // Remove project from student's approvedProjects
                    await Student.findByIdAndUpdate(
                        project.student,
                        { $pull: { approvedProjects: project._id } }
                    );
                }
            }
        }

        await project.save();
        await project.populate('student', 'name roll email');

        res.json({
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error('Update project error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid project ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Student can delete own projects, Admin/Teacher can delete any)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check permissions
        const canDelete = req.user.id === project.student.toString() ||
            req.user.role === 'teacher' ||
            req.user.role === 'admin';

        if (!canDelete) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // If project was approved, remove it from student's approvedProjects
        if (project.approved) {
            const Student = require('../models/Student');
            await Student.findByIdAndUpdate(
                project.student,
                { $pull: { approvedProjects: project._id } }
            );
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid project ID' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get student's own projects
// @route   GET /api/projects/my
// @access  Private (Student)
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ student: req.user.id })
            .populate('student', 'name roll email')
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json({
            projects,
            count: projects.length
        });
    } catch (error) {
        console.error('Get my projects error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    getMyProjects
};