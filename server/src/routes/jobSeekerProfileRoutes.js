const express = require('express');
const router = express.Router();
const {
    createProfile,
    getProfile,
    getProfileById,
    updateProfile,
    deleteProfile
} = require('../controllers/jobSeekerProfileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadResume, handleUploadError } = require('../middleware/upload');

// Protected routes - require authentication
router.post('/', protect, uploadResume, handleUploadError, createProfile);
router.get('/me', protect, getProfile);
router.put('/', protect, uploadResume, handleUploadError, updateProfile);
router.delete('/', protect, deleteProfile);

// Public routes
router.get('/:id', getProfileById);

module.exports = router;
