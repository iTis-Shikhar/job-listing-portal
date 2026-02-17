const JobSeekerProfile = require('../models/JobSeekerProfile');
const { uploadToImageKit, deleteFromImageKit, FOLDERS } = require('../utils/imagekitUpload');

/**
 * Build resume filename: e.g. CV_Chiranjit-Das.pdf (original base + underscore + user name + extension)
 */
const getResumeFileName = (originalName, fullName) => {
    const lastDot = originalName.lastIndexOf('.');
    const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
    const ext = lastDot > 0 ? originalName.slice(lastDot) : '';
    const namePart = (fullName || '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-]/g, ''); // safe for filenames
    return namePart ? `${base}_${namePart}${ext}` : originalName;
};

// @desc    Create job seeker profile
// @route   POST /api/profile/jobseeker
// @access  Private
const createProfile = async (req, res) => {
    try {
        // Log incoming data for debugging
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('User ID:', req.user.id);

        // Check if profile already exists
        const existingProfile = await JobSeekerProfile.findOne({ user: req.user.id });
        
        if (existingProfile) {
            console.log('400: Profile already exists for user', req.user.id, '- use PUT to update.');
            return res.status(400).json({
                success: false,
                error: 'Profile already exists. Use PUT /api/profile/jobseeker to update.'
            });
        }

        // Parse skills - handle both string and array
        let skillsArray = [];
        if (req.body.skills) {
            try {
                skillsArray = typeof req.body.skills === 'string' 
                    ? JSON.parse(req.body.skills) 
                    : req.body.skills;
            } catch (e) {
                console.log('Skills parsing error:', e.message);
                skillsArray = [];
            }
        }

        // Prepare profile data (coerce types for schema)
        const profileData = {
            user: req.user.id,
            fullName: req.body.fullName,
            dateOfBirth: req.body.dateOfBirth || undefined,
            gender: req.body.gender || undefined,
            location: {
                city: req.body.city,
                state: req.body.state,
                country: req.body.country
            },
            phone: req.body.phone,
            alternateEmail: req.body.alternateEmail || undefined,
            linkedIn: req.body.linkedIn || undefined,
            portfolio: req.body.portfolio || undefined,
            currentJobTitle: req.body.currentJobTitle,
            yearsOfExperience: req.body.yearsOfExperience !== undefined && req.body.yearsOfExperience !== ''
                ? Number(req.body.yearsOfExperience)
                : 0,
            skills: skillsArray,
            bio: req.body.bio
        };

        // Upload resume to ImageKit if file was uploaded (filename: e.g. CV_Chiranjit-Das.pdf)
        if (req.file) {
            const resumeFileName = getResumeFileName(req.file.originalname, req.body.fullName);
            const uploadResult = await uploadToImageKit(
                req.file.buffer,
                resumeFileName,
                FOLDERS.RESUMES
            );

            profileData.resume = {
                fileId: uploadResult.fileId,
                url: uploadResult.url,
                originalName: resumeFileName,
                uploadedAt: Date.now()
            };
        }

        console.log('Profile data to create:', profileData);

        const profile = await JobSeekerProfile.create(profileData);

        res.status(201).json({
            success: true,
            data: profile
        });
    } catch (error) {
        // Log the full error for debugging
        console.error('Error creating profile:', error);
        // Return validation details for Mongoose ValidationError
        const isValidationError = error.name === 'ValidationError';
        const message = isValidationError && error.errors
            ? Object.values(error.errors).map(e => e.message).join('; ')
            : error.message;
        res.status(400).json({
            success: false,
            error: message
        });
    }
};

// @desc    Get current user's profile
// @route   GET /api/profile/jobseeker/me
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await JobSeekerProfile.findOne({ user: req.user.id }).populate('user', 'name email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get profile by ID
// @route   GET /api/profile/jobseeker/:id
// @access  Public
const getProfileById = async (req, res) => {
    try {
        const profile = await JobSeekerProfile.findById(req.params.id).populate('user', 'name email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update job seeker profile
// @route   PUT /api/profile/jobseeker
// @access  Private
const updateProfile = async (req, res) => {
    try {
        let profile = await JobSeekerProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        // Parse skills for update
        let skillsArray = profile.skills;
        if (req.body.skills !== undefined) {
            try {
                skillsArray = typeof req.body.skills === 'string'
                    ? JSON.parse(req.body.skills)
                    : req.body.skills;
            } catch (e) {
                skillsArray = profile.skills;
            }
        }
        const yearsVal = req.body.yearsOfExperience;
        const yearsOfExperience = yearsVal !== undefined && yearsVal !== ''
            ? Number(yearsVal)
            : profile.yearsOfExperience;

        // Prepare update data
        const updateData = {
            fullName: req.body.fullName ?? profile.fullName,
            dateOfBirth: req.body.dateOfBirth ?? profile.dateOfBirth,
            gender: req.body.gender ?? profile.gender,
            location: {
                city: req.body.city ?? profile.location?.city,
                state: req.body.state ?? profile.location?.state,
                country: req.body.country ?? profile.location?.country
            },
            phone: req.body.phone ?? profile.phone,
            alternateEmail: req.body.alternateEmail ?? profile.alternateEmail,
            linkedIn: req.body.linkedIn ?? profile.linkedIn,
            portfolio: req.body.portfolio ?? profile.portfolio,
            currentJobTitle: req.body.currentJobTitle ?? profile.currentJobTitle,
            yearsOfExperience,
            skills: skillsArray,
            bio: req.body.bio ?? profile.bio
        };

        // Handle resume replacement (filename: e.g. CV_Chiranjit-Das.pdf)
        if (req.file) {
            // Delete old resume from ImageKit if it exists
            if (profile.resume && profile.resume.fileId) {
                await deleteFromImageKit(profile.resume.fileId);
            }

            const fullName = req.body.fullName ?? profile.fullName;
            const resumeFileName = getResumeFileName(req.file.originalname, fullName);
            const uploadResult = await uploadToImageKit(
                req.file.buffer,
                resumeFileName,
                FOLDERS.RESUMES
            );

            // Add new resume data
            updateData.resume = {
                fileId: uploadResult.fileId,
                url: uploadResult.url,
                originalName: resumeFileName,
                uploadedAt: Date.now()
            };
        }

        profile = await JobSeekerProfile.findOneAndUpdate(
            { user: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        const isValidationError = error.name === 'ValidationError';
        const message = isValidationError && error.errors
            ? Object.values(error.errors).map(e => e.message).join('; ')
            : error.message;
        res.status(400).json({
            success: false,
            error: message
        });
    }
};

// @desc    Delete job seeker profile
// @route   DELETE /api/profile/jobseeker
// @access  Private
const deleteProfile = async (req, res) => {
    try {
        const profile = await JobSeekerProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        // Delete resume from ImageKit if it exists
        if (profile.resume && profile.resume.fileId) {
            await deleteFromImageKit(profile.resume.fileId);
        }

        await JobSeekerProfile.findOneAndDelete({ user: req.user.id });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createProfile,
    getProfile,
    getProfileById,
    updateProfile,
    deleteProfile
};
