const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getJobSeekerApplications,
    getEmployerApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect); // All application routes are protected

router.post('/', upload.single('resume'), applyToJob);
router.get('/my-applications', getJobSeekerApplications);
router.get('/employer/me', getEmployerApplications);
router.patch('/:id/status', updateApplicationStatus);

module.exports = router;
