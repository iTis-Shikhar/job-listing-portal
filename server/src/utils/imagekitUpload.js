const imagekit = require('../config/imagekit.config');

// ImageKit folder structure: root JOB-LISTING-PORTAL with subfolders
const IMAGEKIT_ROOT = 'JOB-LISTING-PORTAL';
const FOLDERS = {
    RESUMES: `${IMAGEKIT_ROOT}/resumes`,
    OTHERS: `${IMAGEKIT_ROOT}/others`
};

/**
 * Upload file to ImageKit
 * @param {Buffer} fileBuffer - File buffer from multer memory storage
 * @param {String} fileName - Name for the file
 * @param {String} folder - Folder path in ImageKit (e.g. FOLDERS.RESUMES, FOLDERS.OTHERS)
 * @param {Object} options - Additional ImageKit upload options
 * @returns {Promise<Object>} - Upload response with fileId, url, etc.
 */
const uploadToImageKit = async (fileBuffer, fileName, folder = '', options = {}) => {
    try {
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: fileName,
            folder: folder || FOLDERS.OTHERS,
            useUniqueFileName: true,
            ...options
        });

        return {
            success: true,
            fileId: uploadResponse.fileId,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            name: uploadResponse.name,
            filePath: uploadResponse.filePath
        };
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw new Error(`Failed to upload file to ImageKit: ${error.message}`);
    }
};

/**
 * Delete file from ImageKit
 * @param {String} fileId - ImageKit file ID
 * @returns {Promise<Boolean>} - Success status
 */
const deleteFromImageKit = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
        return true;
    } catch (error) {
        console.error('ImageKit delete error:', error);
        // Don't throw error, just log it - file might already be deleted
        return false;
    }
};

/**
 * Get file details from ImageKit
 * @param {String} fileId - ImageKit file ID
 * @returns {Promise<Object>} - File details
 */
const getFileDetails = async (fileId) => {
    try {
        const fileDetails = await imagekit.getFileDetails(fileId);
        return fileDetails;
    } catch (error) {
        console.error('ImageKit get file details error:', error);
        throw new Error(`Failed to get file details: ${error.message}`);
    }
};

/**
 * Validate file type
 * @param {String} mimetype - File MIME type
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {Boolean} - Validation result
 */
const validateFileType = (mimetype, allowedTypes) => {
    return allowedTypes.includes(mimetype);
};

/**
 * Allowed MIME types for different file categories
 */
const ALLOWED_MIME_TYPES = {
    resumes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    images: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ],
    documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ]
};

module.exports = {
    uploadToImageKit,
    deleteFromImageKit,
    getFileDetails,
    validateFileType,
    ALLOWED_MIME_TYPES,
    IMAGEKIT_ROOT,
    FOLDERS
};
