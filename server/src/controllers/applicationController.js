const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const { uploadToImageKit, FOLDERS } = require('../utils/imagekitUpload');
const { createNotification } = require('./notificationController');


//   Build resume filename consistent:

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

const applyToJob = async (req, res) => {
    try {
        const { jobId, coverLetter, source, applicantDetails } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a resume'
            });
        }

        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                error: 'Only job seekers can apply for jobs'
            });
        }

        const job = await Job.findById(jobId);
        if (!job || job.status !== 'Active') {
            return res.status(404).json({
                success: false,
                error: 'Job not found or is no longer accepting applications'
            });
        }

        const jobSeekerProfile = await JobSeekerProfile.findOne({ user: req.user.id });
        if (source === 'Profile' && !jobSeekerProfile) {
            return res.status(400).json({
                success: false,
                error: 'Please create your profile before applying with your account profile'
            });
        }

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

        let finalApplicantDetails = {};
        if (source === 'Manual' || source === 'Auto-detect') {
            finalApplicantDetails = typeof applicantDetails === 'string' ? JSON.parse(applicantDetails) : applicantDetails;
        }

        const applicantName = finalApplicantDetails?.name || req.user.name || '';
        const resumeFileName = getResumeFileName(req.file.originalname, applicantName);
        const uploadResult = await uploadToImageKit(
            req.file.buffer,
            resumeFileName,
            FOLDERS.RESUMES
        );

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

        // 🔔 Notify the employer about the new application (fire-and-forget)
        createNotification(
            job.employer,
            'APPLICATION_RECEIVED',
            `New application received for "${job.title}"`,
            { refModel: 'Application', refId: application._id }
        ).catch(err => console.error('Notification error (applyToJob):', err.message));

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
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        let application = await Application.findById(req.params.id).populate('job', 'title');

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

        const previousStatus = application.status;

        application.status = status;

        if (note) {
            application.notes.push({
                text: note,
                author: req.user.id
            });
        }

        await application.save();

        // 🔔 Notify the job seeker about the status change
        if (status !== previousStatus) {
            try {
                await createNotification(
                    application.jobSeeker,
                    'APPLICATION_STATUS',
                    `Your application for "${application.job?.title || 'a job'}" has been updated to: ${status}`,
                    { refModel: 'Application', refId: application._id }
                );
            } catch (notifErr) {
                console.error('Notification error (updateApplicationStatus):', notifErr.message);
            }
        }

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
