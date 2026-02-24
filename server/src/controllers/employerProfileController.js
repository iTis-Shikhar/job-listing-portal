const EmployerProfile = require('../models/EmployerProfile');

// @desc    Create employer profile
// @route   POST /api/profile/employer
// @access  Private
const createProfile = async (req, res) => {
    try {
        // Check if profile already exists
        const existingProfile = await EmployerProfile.findOne({ user: req.user.id });
        
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                error: 'Profile already exists. Use update endpoint to modify.'
            });
        }

        // Prepare profile data
        const profileData = {
            user: req.user.id,
            companyName: req.body.companyName,
            industry: req.body.industry,
            companySize: req.body.companySize,
            foundedYear: req.body.foundedYear,
            website: req.body.website,
            about: req.body.about,
            mission: req.body.mission,
            companyPhone: req.body.companyPhone,
            companyEmail: req.body.companyEmail,
            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                postalCode: req.body.postalCode
            },
            socialLinks: {
                linkedin: req.body.linkedin,
                twitter: req.body.twitter,
                facebook: req.body.facebook
            }
        };

        const profile = await EmployerProfile.create(profileData);

        res.status(201).json({
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

// @desc    Get current user's employer profile
// @route   GET /api/profile/employer/me
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await EmployerProfile.findOne({ user: req.user.id }).populate('user', 'name email');

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

// @desc    Get employer profile by ID
// @route   GET /api/profile/employer/:id
// @access  Public
const getProfileById = async (req, res) => {
    try {
        const profile = await EmployerProfile.findById(req.params.id).populate('user', 'name email');

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

// @desc    Update employer profile
// @route   PUT /api/profile/employer
// @access  Private
const updateProfile = async (req, res) => {
    try {
        let profile = await EmployerProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        // Prepare update data
        const updateData = {
            companyName: req.body.companyName || profile.companyName,
            industry: req.body.industry || profile.industry,
            companySize: req.body.companySize || profile.companySize,
            foundedYear: req.body.foundedYear || profile.foundedYear,
            website: req.body.website || profile.website,
            about: req.body.about || profile.about,
            mission: req.body.mission || profile.mission,
            companyPhone: req.body.companyPhone || profile.companyPhone,
            companyEmail: req.body.companyEmail || profile.companyEmail,
            address: {
                street: req.body.street || profile.address.street,
                city: req.body.city || profile.address.city,
                state: req.body.state || profile.address.state,
                country: req.body.country || profile.address.country,
                postalCode: req.body.postalCode || profile.address.postalCode
            },
            socialLinks: {
                linkedin: req.body.linkedin || profile.socialLinks.linkedin,
                twitter: req.body.twitter || profile.socialLinks.twitter,
                facebook: req.body.facebook || profile.socialLinks.facebook
            }
        };

        profile = await EmployerProfile.findOneAndUpdate(
            { user: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

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

// @desc    Delete employer profile
// @route   DELETE /api/profile/employer
// @access  Private
const deleteProfile = async (req, res) => {
    try {
        const profile = await EmployerProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        await EmployerProfile.findOneAndDelete({ user: req.user.id });

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
