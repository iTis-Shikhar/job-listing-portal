const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// @desc    Create a new job listing
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
    try {
        // Check if user is an employer
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                error: 'Only employers can create job listings'
            });
        }

        // Check if employer has a profile
        const employerProfile = await EmployerProfile.findOne({ user: req.user.id });

        if (!employerProfile) {
            return res.status(400).json({
                success: false,
                error: 'Please create an employer profile first'
            });
        }

        // Prepare job data with employer and profile references
        const jobData = {
            ...req.body,
            employer: req.user.id,
            employerProfile: employerProfile._id
        };

        // Create job
        const job = await Job.create(jobData);

        // Populate employer and profile data before sending response
        await job.populate('employer', 'name email');
        await job.populate('employerProfile', 'companyName industry website');

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get all jobs (public, only Active by default)
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Filter by status (default to Active for public access)
        const status = req.query.status || 'Active';
        const filter = { status };

        // Count total documents
        const total = await Job.countDocuments(filter);

        // Get jobs with pagination
        const jobs = await Job.find(filter)
            .populate('employer', 'name email')
            .populate('employerProfile', 'companyName industry website location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            count: jobs.length,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total
            },
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employer', 'name email')
            .populate('employerProfile', 'companyName industry website companySize foundedYear about address socialLinks');

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/employer/me
// @access  Private (Employer only)
const getEmployerJobs = async (req, res) => {
    try {
        // Check if user is an employer
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                error: 'Only employers can access this route'
            });
        }

        // Get all jobs by this employer (all statuses)
        const jobs = await Job.find({ employer: req.user.id })
            .populate('employerProfile', 'companyName')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private (Employer only, own jobs)
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Check if user is the employer who created this job
        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to modify this job'
            });
        }

        // Don't allow changing employer or employerProfile
        delete req.body.employer;
        delete req.body.employerProfile;

        // Update job
        job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('employer', 'name email')
            .populate('employerProfile', 'companyName industry website');

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only, own jobs)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Check if user is the employer who created this job
        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this job'
            });
        }

        // Soft delete - set status to Closed instead of hard delete
        // This preserves data for potential future application history
        await Job.findByIdAndUpdate(req.params.id, { status: 'Closed' });

        res.status(200).json({
            success: true,
            data: {},
            message: 'Job listing closed successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
// @access  Private (Employer only, own jobs)
const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Active', 'Inactive', 'Closed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Check if user is the employer who created this job
        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to modify this job'
            });
        }

        // Update status
        job = await Job.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('employer', 'name email')
            .populate('employerProfile', 'companyName industry website');

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Toggle save/unsave a job
// @route   POST /api/jobs/:id/save
// @access  Private (Job Seeker only)
const toggleSaveJob = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                error: 'Only job seekers can save jobs'
            });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        const profile = await JobSeekerProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Please create your profile first'
            });
        }

        const alreadySaved = profile.savedJobs.some(
            id => id.toString() === req.params.id
        );

        if (alreadySaved) {
            profile.savedJobs = profile.savedJobs.filter(
                id => id.toString() !== req.params.id
            );
        } else {
            profile.savedJobs.push(req.params.id);
        }

        await profile.save();

        res.status(200).json({
            success: true,
            saved: !alreadySaved,
            message: alreadySaved ? 'Job removed from saved list' : 'Job saved successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    getEmployerJobs,
    updateJob,
    deleteJob,
    updateJobStatus,
    toggleSaveJob
};
