const multer = require('multer');
const path = require('path');

// Configure memory storage for ImageKit upload
// Files will be stored in memory as buffers instead of disk
const storage = multer.memoryStorage();

// File filter to accept specific file types
const fileFilter = (req, file, cb) => {
    // Allowed file extensions
    const allowedExtensions = [
        '.pdf', '.doc', '.docx',           // Documents
        '.jpg', '.jpeg', '.png', '.gif', '.webp',  // Images
        '.xls', '.xlsx', '.txt'            // Additional documents
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Allowed MIME types
    const allowedMimeTypes = [
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, images (JPG, PNG, GIF, WebP), XLS, XLSX, TXT'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware for handling single resume upload
const uploadResume = upload.single('resume');

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            error: err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    next();
};

module.exports = {
    uploadResume,
    handleUploadError
};
