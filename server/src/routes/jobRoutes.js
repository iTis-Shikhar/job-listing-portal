const express = require('express');
const router = express.Router();
const {
    createJob,
    getAllJobs,
    getJobById,
    getEmployerJobs,
    updateJob,
    deleteJob,
    updateJobStatus
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);

// Protected routes (require authentication)
router.post('/', protect, createJob);
router.get('/employer/me', protect, getEmployerJobs); // Must be before /:id

// Public route for single job (after specific routes to avoid conflicts)
router.get('/:id', getJobById);

// Protected routes for updating/deleting specific jobs
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.patch('/:id/status', protect, updateJobStatus);

module.exports = router;
