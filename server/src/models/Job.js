const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Employer is required']
    },
    employerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployerProfile',
        required: [true, 'Employer profile is required']
    },
    title: {
        type: String,
        required: [true, 'Job title is required'],
        minlength: [3, 'Job title must be at least 3 characters'],
        maxlength: [100, 'Job title cannot exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        minlength: [50, 'Job description must be at least 50 characters'],
        maxlength: [5000, 'Job description cannot exceed 5000 characters']
    },
    jobType: {
        type: String,
        required: [true, 'Job type is required'],
        enum: {
            values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
            message: 'Job type must be Full-time, Part-time, Contract, Internship, or Freelance'
        }
    },
    location: {
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State/Province is required'],
            trim: true
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true
        },
        isRemote: {
            type: Boolean,
            default: false
        }
    },
    salaryRange: {
        min: {
            type: Number,
            min: [0, 'Minimum salary cannot be negative'],
            default: null
        },
        max: {
            type: Number,
            min: [0, 'Maximum salary cannot be negative'],
            validate: {
                validator: function (value) {
                    // Only validate if both min and max are provided
                    if (this.salaryRange.min && value) {
                        return value >= this.salaryRange.min;
                    }
                    return true;
                },
                message: 'Maximum salary must be greater than or equal to minimum salary'
            },
            default: null
        },
        currency: {
            type: String,
            default: 'USD',
            uppercase: true
        },
        period: {
            type: String,
            enum: {
                values: ['Hourly', 'Monthly', 'Yearly'],
                message: 'Period must be Hourly, Monthly, or Yearly'
            },
            default: null
        }
    },
    requirements: {
        education: {
            type: String,
            enum: {
                values: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Not Required'],
                message: 'Invalid education level'
            },
            default: null
        },
        experience: {
            type: String,
            enum: {
                values: ['Entry Level', '1-2 years', '3-5 years', '5-10 years', '10+ years'],
                message: 'Invalid experience level'
            },
            default: null
        },
        skills: {
            type: [String],
            required: [true, 'At least one skill is required'],
            validate: {
                validator: function (skills) {
                    return skills && skills.length > 0;
                },
                message: 'At least one skill is required'
            }
        },
        qualifications: {
            type: [String],
            default: []
        }
    },
    responsibilities: {
        type: [String],
        required: [true, 'At least one responsibility is required'],
        validate: {
            validator: function (responsibilities) {
                return responsibilities && responsibilities.length > 0;
            },
            message: 'At least one responsibility is required'
        }
    },
    benefits: {
        type: [String],
        default: []
    },
    applicationDeadline: {
        type: Date,
        default: null,
        validate: {
            validator: function (date) {
                // Only validate if deadline is provided
                if (date) {
                    return date > new Date();
                }
                return true;
            },
            message: 'Application deadline must be in the future'
        }
    },
    openings: {
        type: Number,
        required: [true, 'Number of openings is required'],
        min: [1, 'At least one opening is required'],
        default: 1
    },
    status: {
        type: String,
        enum: {
            values: ['Active', 'Inactive', 'Closed'],
            message: 'Status must be Active, Inactive, or Closed'
        },
        default: 'Active'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
jobSchema.index({ employer: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'location.city': 1, jobType: 1 }); // Compound index for search

// Virtual for checking if job is expired
jobSchema.virtual('isExpired').get(function () {
    if (this.applicationDeadline) {
        return new Date() > this.applicationDeadline;
    }
    return false;
});

// Ensure virtuals are included when converting to JSON
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
