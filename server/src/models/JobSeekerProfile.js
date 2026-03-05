const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Please provide your full name']
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    location: {
        city: String,
        state: String,
        country: String
    },
    // Contact Details
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
    },
    alternateEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    linkedIn: {
        type: String,
        match: [
            /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
            'Please provide a valid LinkedIn URL'
        ]
    },
    portfolio: {
        type: String,
        match: [
            /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}.*$/,
            'Please provide a valid URL'
        ]
    },
    // Resume
    resume: {
        fileId: String,        // ImageKit file ID for deletion
        url: String,           // ImageKit URL for access
        originalName: String,  // Original filename
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    // Professional Details
    currentJobTitle: {
        type: String
    },
    yearsOfExperience: {
        type: Number,
        min: 0,
        default: 0
    },
    skills: [{
        type: String,
        trim: true
    }],
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    // Saved / Bookmarked Jobs
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
jobSeekerProfileSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);
