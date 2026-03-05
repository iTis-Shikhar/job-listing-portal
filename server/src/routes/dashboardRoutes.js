const express = require('express');
const router = express.Router();
const { getJobSeekerDashboard, getEmployerDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/jobseeker', protect, getJobSeekerDashboard);
router.get('/employer', protect, getEmployerDashboard);

module.exports = router;
