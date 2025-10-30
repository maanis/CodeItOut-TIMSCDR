const express = require('express');
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    getMyProjects
} = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Student)
router.post('/', auth, createProject);

// @route   GET /api/projects
// @desc    Get all projects (approved only for public, all for admin/teacher)
// @access  Public/Private
router.get('/', getProjects);

// @route   GET /api/projects/my
// @desc    Get current student's projects
// @access  Private (Student)
router.get('/my', auth, getMyProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public/Private (approved projects or own projects)
router.get('/:id', getProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Student for own projects, Admin/Teacher for any)
router.put('/:id', auth, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Student for own projects, Admin/Teacher for any)
router.delete('/:id', auth, deleteProject);

module.exports = router;