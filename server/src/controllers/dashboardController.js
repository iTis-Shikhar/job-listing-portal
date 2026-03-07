const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const Notification = require('../models/Notification');

//  Calculate profile completion score for a job seeker (0-100)
const calcProfileScore = (profile) => {
    if (!profile) return 0;
    const fields = [
        profile.fullName,
        profile.phone,
        profile.bio,
        profile.skills?.length > 0,
        profile.resume?.url,
        profile.linkedIn,
        profile.portfolio,
        profile.currentJobTitle,
        profile.yearsOfExperience != null && Number.isFinite(profile.yearsOfExperience)
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
};

/**
 * Build a date filter from ?period=7d|30d|all
 * Returns a MongoDB $gte date, or null if 'all'
 */
const getPeriodFilter = (period) => {
    const now = new Date();
    if (period === '7d') {
        return new Date(now.setDate(now.getDate() - 7));
    }
    if (period === '30d') {
        return new Date(now.setDate(now.getDate() - 30));
    }
    return null; // 'all' or unspecified — no date filter
};

// @desc    Get job seeker dashboard
// @route   GET /api/dashboard/jobseeker?period=7d|30d|all
const getJobSeekerDashboard = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Job seekers only.'
            });
        }

        const { period = 'all' } = req.query;
        const sinceDate = getPeriodFilter(period);

        // Fetch profile and populate saved jobs
        const profile = await JobSeekerProfile.findOne({ user: req.user.id })
            .populate({
                path: 'savedJobs',
                select: 'title location jobType salaryRange status',
                populate: { path: 'employerProfile', select: 'companyName industry' }
            });

        // Build application query (with optional date range)
        const appQuery = { jobSeeker: req.user.id };
        if (sinceDate) appQuery.createdAt = { $gte: sinceDate };

        // Fetch applications in the selected period
        const applications = await Application.find(appQuery)
            .populate({
                path: 'job',
                select: 'title location salaryRange jobType',
                populate: { path: 'employerProfile', select: 'companyName industry' }
            })
            .sort({ createdAt: -1 });

        // Group by status
        const byStatus = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        // Unread notifications count
        const unreadNotifications = await Notification.countDocuments({
            recipient: req.user.id,
            read: false
        });

        // Recent notifications
        const recentNotifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            period,
            data: {
                profile: profile || null,
                profileCompletionScore: calcProfileScore(profile),
                applications: {
                    total: applications.length,
                    byStatus,
                    recent: applications.slice(0, 5)
                },
                savedJobs: profile?.savedJobs || [],
                notifications: {
                    unreadCount: unreadNotifications,
                    recent: recentNotifications
                }
            }
        });
    } catch (error) {
        console.error('getJobSeekerDashboard error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// @desc    Get employer dashboard
// @route   GET /api/dashboard/employer?period=7d|30d|all
// @access  Private (Employer only)
const getEmployerDashboard = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Employers only.'
            });
        }

        const { period = 'all' } = req.query;
        const sinceDate = getPeriodFilter(period);

        // Fetch employer profile
        const profile = await EmployerProfile.findOne({ user: req.user.id });

        // Fetch all jobs by this employer
        const jobs = await Job.find({ employer: req.user.id })
            .select('title status jobType location createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Build application query (with optional date range)
        const appQuery = { employer: req.user._id };
        if (sinceDate) appQuery.createdAt = { $gte: sinceDate };

        // Aggregate funnel counts per job (avoids loading all documents into memory)
        const appStats = await Application.aggregate([
            { $match: appQuery },
            {
                $group: {
                    _id: { job: '$job', status: '$status' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Fetch only the most recent applications (bounded)
        const recentApplications = await Application.find(appQuery)
            .populate('job', 'title')
            .populate('jobSeeker', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Build appsByJob map from aggregation results
        const appsByJob = appStats.reduce((acc, item) => {
            const jobId = item._id.job?.toString();
            if (!jobId) return acc;
            if (!acc[jobId]) acc[jobId] = { total: 0, funnel: {} };
            acc[jobId].total += item.count;
            acc[jobId].funnel[item._id.status] = item.count;
            return acc;
        }, {});

        // Merge application counts into job listings
        const listings = jobs.map(job => ({
            ...job,
            applicationCount: appsByJob[job._id.toString()]?.total || 0,
            funnel: appsByJob[job._id.toString()]?.funnel || {}
        }));

        // Jobs grouped by status
        const jobsByStatus = jobs.reduce((acc, job) => {
            acc[job.status] = (acc[job.status] || 0) + 1;
            return acc;
        }, {});

        // Unread notifications count
        const unreadNotifications = await Notification.countDocuments({
            recipient: req.user.id,
            read: false
        });

        // Recent notifications
        const recentNotifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            period,
            data: {
                profile: profile || null,
                jobs: {
                    total: jobs.length,
                    byStatus: jobsByStatus,
                    listings
                },
                applications: {
                    total: appStats.reduce((sum, s) => sum + s.count, 0),
                    recent: recentApplications.slice(0, 5)
                },
                notifications: {
                    unreadCount: unreadNotifications,
                    recent: recentNotifications
                }
            }
        });
    } catch (error) {
        console.error('getEmployerDashboard error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = { getJobSeekerDashboard, getEmployerDashboard };
