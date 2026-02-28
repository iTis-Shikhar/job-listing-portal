const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job reference is required']
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Job seeker is required']
    },
    jobSeekerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeekerProfile',
        required: false
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Employer reference is required']
    },
    source: {
        type: String,
        enum: ['Profile', 'Manual', 'Auto-detect'],
        default: 'Profile'
    },
    applicantDetails: {
        name: String,
        email: String,
        phone: String,
        skills: [String],
        experience: String
    },
    resume: {
        fileId: {
            type: String,
            required: [true, 'Resume file ID is required']
        },
        url: {
            type: String,
            required: [true, 'Resume URL is required']
        },
        originalName: {
            type: String
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    coverLetter: {
        type: String,
        maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['Applied', 'Reviewed', 'Shortlisted', 'Interviewing', 'Rejected', 'Accepted', 'Withdrawn'],
            message: 'Invalid application status'
        },
        default: 'Applied'
    },
    notes: [
        {
            text: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

// Indexes for common queries
applicationSchema.index({ employer: 1, status: 1 });
applicationSchema.index({ jobSeeker: 1, status: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ 'applicantDetails.email': 1 }); // For manual application tracking

module.exports = mongoose.model('Application', applicationSchema);
