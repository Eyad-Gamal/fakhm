/**
 * Integration tests for CloudinaryService
 * Task 1.2: Create Cloudinary service module
 * 
 * These tests verify that the CloudinaryService can interact with Cloudinary API
 * Note: These tests use actual Cloudinary API, so they require valid credentials
 */

const CloudinaryService = require('../../api/services/cloudinary.service');

describe('CloudinaryService Integration Tests', () => {
    // Skip these tests if not in integration test mode
    const shouldRunIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true';

    describe('Configuration', () => {
        it('should have valid Cloudinary configuration', () => {
            expect(process.env.CLOUDINARY_CLOUD_NAME).toBeDefined();
            expect(process.env.CLOUDINARY_API_KEY).toBeDefined();
            expect(process.env.CLOUDINARY_API_SECRET).toBeDefined();
        });
    });

    describe('Upload and Delete Flow', () => {
        // Create a minimal test image buffer (1x1 red pixel PNG)
        const testImageBuffer = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            'base64'
        );

        let uploadedPublicId;

        (shouldRunIntegrationTests ? it : it.skip)('should upload an image to Cloudinary', async () => {
            const result = await CloudinaryService.uploadImage(testImageBuffer, {
                folder: 'test/unit-tests'
            });

            expect(result).toBeDefined();
            expect(result.url).toBeDefined();
            expect(result.publicId).toBeDefined();
            expect(result.url).toContain('https://res.cloudinary.com/');
            expect(result.publicId).toContain('test/unit-tests');

            uploadedPublicId = result.publicId;
        }, 10000); // 10 second timeout for upload

        (shouldRunIntegrationTests ? it : it.skip)('should delete the uploaded image from Cloudinary', async () => {
            if (!uploadedPublicId) {
                // If upload was skipped, skip this test too
                return;
            }

            const result = await CloudinaryService.deleteImage(uploadedPublicId);

            expect(result).toBeDefined();
            expect(result.result).toBe('ok');
        }, 10000); // 10 second timeout for delete
    });

    describe('Batch Operations', () => {
        const testImageBuffer = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            'base64'
        );

        let uploadedPublicIds = [];

        (shouldRunIntegrationTests ? it : it.skip)('should upload multiple images to Cloudinary', async () => {
            const buffers = [testImageBuffer, testImageBuffer, testImageBuffer];
            const results = await CloudinaryService.uploadImages(buffers, {
                folder: 'test/batch-tests'
            });

            expect(results).toBeDefined();
            expect(results.length).toBe(3);
            results.forEach(result => {
                expect(result.url).toBeDefined();
                expect(result.publicId).toBeDefined();
                expect(result.url).toContain('https://res.cloudinary.com/');
            });

            uploadedPublicIds = results.map(r => r.publicId);
        }, 30000); // 30 second timeout for batch upload

        (shouldRunIntegrationTests ? it : it.skip)('should delete multiple images from Cloudinary', async () => {
            if (uploadedPublicIds.length === 0) {
                // If upload was skipped, skip this test too
                return;
            }

            const results = await CloudinaryService.deleteImages(uploadedPublicIds);

            expect(results).toBeDefined();
            expect(results.length).toBe(3);
            results.forEach(result => {
                expect(result.result).toBe('ok');
            });
        }, 30000); // 30 second timeout for batch delete
    });

    describe('Error Handling', () => {
        (shouldRunIntegrationTests ? it : it.skip)('should handle deletion of non-existent image', async () => {
            const result = await CloudinaryService.deleteImage('test/non-existent-image-12345');

            expect(result).toBeDefined();
            expect(result.result).toBe('not found');
        }, 10000);
    });
});
