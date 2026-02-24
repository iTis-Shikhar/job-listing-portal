const express = require('express');
const router = express.Router();
const {
    createProfile,
    getProfile,
    getProfileById,
    updateProfile,
    deleteProfile
} = require('../controllers/employerProfileController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.post('/', protect, createProfile);
router.get('/me', protect, getProfile);
router.put('/', protect, updateProfile);
router.delete('/', protect, deleteProfile);

// Public routes
router.get('/:id', getProfileById);

module.exports = router;
