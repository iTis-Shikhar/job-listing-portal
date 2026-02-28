const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const { uploadToImageKit, FOLDERS } = require('../utils/imagekitUpload');

/**
 * Build resume filename consistent with jobSeekerProfileController:
 * e.g. CV_Chiranjit-Das.pdf
 */
const getResumeFileName = (originalName, fullName) => {
    const lastDot = originalName.lastIndexOf('.');
    const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
    const ext = lastDot > 0 ? originalName.slice(lastDot) : '';
    const namePart = (fullName || '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-]/g, '');
    return namePart ? `${base}_${namePart}${ext}` : originalName;
};

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Job Seeker only)
const applyToJob = async (req, res) => {
    try {
        const { jobId, coverLetter, source, applicantDetails } = req.body;

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a resume'
            });
        }

        // Check if user is a job seeker
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                error: 'Only job seekers can apply for jobs'
            });
        }

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job || job.status !== 'Active') {
            return res.status(404).json({
                success: false,
                error: 'Job not found or is no longer accepting applications'
            });
        }

        // Check if job seeker has a profile (required for 'Profile' source)
        const jobSeekerProfile = await JobSeekerProfile.findOne({ user: req.user.id });
        if (source === 'Profile' && !jobSeekerProfile) {
            return res.status(400).json({
                success: false,
                error: 'Please create your profile before applying with your account profile'
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            jobSeeker: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'You have already applied for this job'
            });
        }

        // Prepare applicant details based on source
        let finalApplicantDetails = {};
        if (source === 'Manual' || source === 'Auto-detect') {
            finalApplicantDetails = typeof applicantDetails === 'string' ? JSON.parse(applicantDetails) : applicantDetails;
        }

        // Upload resume to ImageKit
        const applicantName = finalApplicantDetails?.name || req.user.name || '';
        const resumeFileName = getResumeFileName(req.file.originalname, applicantName);
        const uploadResult = await uploadToImageKit(
            req.file.buffer,
            resumeFileName,
            FOLDERS.RESUMES
        );

        // Create application
        const application = await Application.create({
            job: jobId,
            jobSeeker: req.user.id,
            jobSeekerProfile: jobSeekerProfile ? jobSeekerProfile._id : null,
            employer: job.employer,
            resume: {
                fileId: uploadResult.fileId,
                url: uploadResult.url,
                originalName: resumeFileName,
                uploadedAt: Date.now()
            },
            coverLetter,
            source: source || 'Profile',
            applicantDetails: finalApplicantDetails
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get applications for logged in job seeker
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
const getJobSeekerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ jobSeeker: req.user.id })
            .populate({
                path: 'job',
                select: 'title location salaryRange jobType',
                populate: {
                    path: 'employerProfile',
                    select: 'companyName industry'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get applications for an employer's jobs
// @route   GET /api/applications/employer/me
// @access  Private (Employer only)
const getEmployerApplications = async (req, res) => {
    try {
        const { jobId } = req.query;
        const query = { employer: req.user.id };

        if (jobId) {
            query.job = jobId;
        }

        const applications = await Application.find(query)
            .populate('job', 'title')
            .populate('jobSeeker', 'name email')
            .populate('jobSeekerProfile', 'personalInfo skills experience')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Check if employer is the owner of the job
        if (application.employer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this application'
            });
        }

        // Update status
        application.status = status;

        // Add note if provided
        if (note) {
            application.notes.push({
                text: note,
                author: req.user.id
            });
        }

        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    applyToJob,
    getJobSeekerApplications,
    getEmployerApplications,
    updateApplicationStatus
};
