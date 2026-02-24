const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Company Information
    companyName: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true
    },
    industry: {
        type: String,
        required: [true, 'Please provide industry'],
        trim: true
    },
    companySize: {
        type: String,
        required: [true, 'Please select company size']
    },
    foundedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    website: {
        type: String,
        match: [
            /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}.*$/,
            'Please provide a valid website URL'
        ]
    },
    // Company Description
    about: {
        type: String,
        required: [true, 'Please provide company description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    mission: {
        type: String,
        maxlength: [500, 'Mission statement cannot exceed 500 characters']
    },
    // Contact Details
    companyPhone: {
        type: String,
        required: [true, 'Please provide company phone number'],
        match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
    },
    companyEmail: {
        type: String,
        required: [true, 'Please provide company email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    address: {
        street: String,
        city: {
            type: String,
            required: [true, 'Please provide city']
        },
        state: {
            type: String,
            required: [true, 'Please provide state']
        },
        country: {
            type: String,
            required: [true, 'Please provide country']
        },
        postalCode: String
    },
    // Social Links
    socialLinks: {
        linkedin: {
            type: String,
            match: [
                /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
                'Please provide a valid LinkedIn URL'
            ]
        },
        twitter: {
            type: String,
            match: [
                /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.*$/,
                'Please provide a valid Twitter/X URL'
            ]
        },
        facebook: {
            type: String,
            match: [
                /^(https?:\/\/)?(www\.)?facebook\.com\/.*$/,
                'Please provide a valid Facebook URL'
            ]
        }
    },
    // Company Logo (optional for future enhancement)
    logo: {
        filename: String,
        path: String,
        uploadedAt: Date
    },
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
employerProfileSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);
