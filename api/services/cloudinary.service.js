const cloudinary = require('cloudinary').v2;

/**
 * CloudinaryService - Encapsulates all Cloudinary SDK interactions
 * Provides a clean interface for image operations including upload, delete, and utility methods
 */
class CloudinaryService {
    /**
     * Initialize Cloudinary configuration from environment variables
     * @throws {Error} If required environment variables are missing
     */
    constructor() {
        // Validate required environment variables
        const requiredEnvVars = [
            'CLOUDINARY_CLOUD_NAME',
            'CLOUDINARY_API_KEY',
            'CLOUDINARY_API_SECRET'
        ];

        const missingVars = requiredEnvVars.filter(key => !process.env[key]);

        if (missingVars.length > 0) {
            throw new Error(
                `Missing required Cloudinary environment variables: ${missingVars.join(', ')}\n` +
                'Please check your .env file.'
            );
        }

        // Configure Cloudinary with environment variables
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true // Always use HTTPS
        });
    }

    /**
     * Upload a single image to Cloudinary
     * @param {Buffer} fileBuffer - Image file buffer
     * @param {Object} options - Upload options (folder, transformation, etc.)
     * @returns {Promise<{url: string, publicId: string}>}
     */
    async uploadImage(fileBuffer, options = {}) {
        try {
            // Convert buffer to base64 data URI for upload
            const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

            // Set default options
            const uploadOptions = {
                folder: options.folder || 'fakhem',
                resource_type: 'image',
                ...options
            };

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        } catch (error) {
            // Handle different types of Cloudinary errors
            if (error.http_code === 401) {
                throw new Error('Cloudinary authentication failed. Check credentials.');
            } else if (error.http_code === 400) {
                throw new Error(`Invalid upload request: ${error.message}`);
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Upload timeout. Please try again.');
            } else {
                throw new Error(`Upload failed: ${error.message}`);
            }
        }
    }

    /**
     * Upload multiple images to Cloudinary
     * @param {Array<Buffer>} fileBuffers - Array of image file buffers
     * @param {Object} options - Upload options
     * @returns {Promise<Array<{url: string, publicId: string}>>}
     */
    async uploadImages(fileBuffers, options = {}) {
        try {
            // Upload all images in parallel
            const uploadPromises = fileBuffers.map(buffer =>
                this.uploadImage(buffer, options)
            );

            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new Error(`Batch upload failed: ${error.message}`);
        }
    }

    /**
     * Delete an image from Cloudinary by public ID
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<{result: string}>}
     */
    async deleteImage(publicId) {
        try {
            if (!publicId) {
                throw new Error('Public ID is required for deletion');
            }

            const result = await cloudinary.uploader.destroy(publicId);

            return {
                result: result.result // 'ok' if successful, 'not found' if image doesn't exist
            };
        } catch (error) {
            throw new Error(`Image deletion failed: ${error.message}`);
        }
    }

    /**
     * Delete multiple images from Cloudinary
     * @param {Array<string>} publicIds - Array of Cloudinary public IDs
     * @returns {Promise<Array<{result: string}>>}
     */
    async deleteImages(publicIds) {
        try {
            if (!publicIds || publicIds.length === 0) {
                return [];
            }

            // Delete all images in parallel
            const deletePromises = publicIds.map(publicId =>
                this.deleteImage(publicId)
            );

            return await Promise.all(deletePromises);
        } catch (error) {
            throw new Error(`Batch deletion failed: ${error.message}`);
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param {string} url - Cloudinary image URL
     * @returns {string|null} - Public ID or null if not a Cloudinary URL
     */
    extractPublicId(url) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        // Check if it's a Cloudinary URL
        if (!this.isCloudinaryUrl(url)) {
            return null;
        }

        try {
            // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            // Or with transformations: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/v{version}/{public_id}.{format}

            // Extract the part after '/upload/'
            const uploadIndex = url.indexOf('/upload/');
            if (uploadIndex === -1) {
                return null;
            }

            const afterUpload = url.substring(uploadIndex + 8); // +8 to skip '/upload/'

            // Remove version and transformations
            // Pattern: v{digits}/path or transformations/v{digits}/path
            const parts = afterUpload.split('/');

            // Find the part after version (starts with 'v' followed by digits)
            let publicIdStart = 0;
            for (let i = 0; i < parts.length; i++) {
                if (/^v\d+$/.test(parts[i])) {
                    publicIdStart = i + 1;
                    break;
                }
            }

            // Get the public ID parts (everything after version)
            const publicIdParts = parts.slice(publicIdStart);
            const publicIdWithExtension = publicIdParts.join('/');

            // Remove file extension
            const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
            const publicId = lastDotIndex > 0
                ? publicIdWithExtension.substring(0, lastDotIndex)
                : publicIdWithExtension;

            return publicId || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if a string is a Cloudinary URL
     * @param {string} str - String to check
     * @returns {boolean}
     */
    isCloudinaryUrl(str) {
        if (!str || typeof str !== 'string') {
            return false;
        }

        // Check if URL starts with Cloudinary's domain
        // Format: https://res.cloudinary.com/{cloud_name}/
        return str.startsWith('https://res.cloudinary.com/');
    }

    /**
     * Check if a string is a Base64 encoded image
     * @param {string} str - String to check
     * @returns {boolean}
     */
    isBase64Image(str) {
        if (!str || typeof str !== 'string') {
            return false;
        }

        // Check if string starts with data:image/ prefix
        // Format: data:image/{format};base64,{data}
        return str.startsWith('data:image/');
    }
}

// Export singleton instance
module.exports = new CloudinaryService();
