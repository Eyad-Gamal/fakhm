const express = require('express');
const multer = require('multer');
const cloudinaryService = require('../services/cloudinary.service');

const router = express.Router();

// Configure multer for multipart form data with memory storage
const storage = multer.memoryStorage();

// File filter to accept only valid image formats
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file format: ${file.mimetype}. Allowed formats: JPEG, PNG, WebP, GIF`), false);
    }
};

// Configure multer with memory storage, file filter, and size limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 10 // Maximum 10 files
    }
});

/**
 * POST /api/upload
 * Upload one or more images to Cloudinary
 * 
 * Request: multipart/form-data with 'images' field (up to 10 images)
 * Response: {
 *   success: boolean,
 *   images: Array<{url: string, publicId: string}>,
 *   message?: string
 * }
 */
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded. Please provide at least one image.'
            });
        }

        // Upload all files to Cloudinary
        const uploadPromises = req.files.map(file =>
            cloudinaryService.uploadImage(file.buffer, {
                folder: 'fakhem', // Organize images in 'fakhem' folder
                resource_type: 'image'
            })
        );

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        // Return success response with image URLs and public IDs
        res.json({
            success: true,
            images: results,
            message: `Successfully uploaded ${results.length} image(s)`
        });

    } catch (error) {
        console.error('Upload error:', error);

        // Return error response
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload images. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary
 * 
 * Response: {
 *   success: boolean,
 *   message: string
 * }
 */
router.delete('/upload/*publicId', async (req, res) => {
    try {
        // Get public ID from URL parameter
        // Using wildcard to capture public IDs with slashes (e.g., fakhem/image123)
        const publicId = req.params.publicId;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required for deletion'
            });
        }

        // Delete image from Cloudinary
        const result = await cloudinaryService.deleteImage(publicId);

        // Check if deletion was successful
        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else if (result.result === 'not found') {
            res.status(404).json({
                success: false,
                message: 'Image not found on Cloudinary'
            });
        } else {
            res.status(500).json({
                success: false,
                message: `Deletion failed with result: ${result.result}`
            });
        }

    } catch (error) {
        console.error('Delete error:', error);

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete image. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Multer error handling middleware
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds the 5MB limit. Please upload smaller images.'
            });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 10 images allowed per upload.'
            });
        } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name. Please use "images" as the field name.'
            });
        }

        return res.status(400).json({
            success: false,
            message: `Upload error: ${error.message}`
        });
    }

    // Handle file filter errors
    if (error.message && error.message.includes('Invalid file format')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // Pass to next error handler if not a multer error
    next(error);
});

module.exports = router;
