/**
 * Unit tests for CloudinaryService
 * Task 1.2: Create Cloudinary service module
 * 
 * This test file validates:
 * - CloudinaryService initialization with environment variables
 * - Utility methods: isCloudinaryUrl, isBase64Image, extractPublicId
 * - Error handling for missing environment variables
 */

const CloudinaryService = require('../../api/services/cloudinary.service');

describe('CloudinaryService', () => {
    describe('Constructor', () => {
        it('should initialize successfully with valid environment variables', () => {
            // Service is already instantiated as singleton
            expect(CloudinaryService).toBeDefined();
            expect(typeof CloudinaryService.uploadImage).toBe('function');
            expect(typeof CloudinaryService.uploadImages).toBe('function');
            expect(typeof CloudinaryService.deleteImage).toBe('function');
            expect(typeof CloudinaryService.deleteImages).toBe('function');
            expect(typeof CloudinaryService.extractPublicId).toBe('function');
            expect(typeof CloudinaryService.isCloudinaryUrl).toBe('function');
            expect(typeof CloudinaryService.isBase64Image).toBe('function');
        });
    });

    describe('isCloudinaryUrl', () => {
        it('should return true for valid Cloudinary URLs', () => {
            const validUrls = [
                'https://res.cloudinary.com/wwv1h4ll/image/upload/v123/test.jpg',
                'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
                'https://res.cloudinary.com/test/image/upload/c_fill,w_300,h_300/v123/folder/image.png'
            ];

            validUrls.forEach(url => {
                expect(CloudinaryService.isCloudinaryUrl(url)).toBe(true);
            });
        });

        it('should return false for non-Cloudinary URLs', () => {
            const invalidUrls = [
                'http://example.com/image.jpg',
                'https://imgur.com/abc123.jpg',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                '',
                null,
                undefined,
                123
            ];

            invalidUrls.forEach(url => {
                expect(CloudinaryService.isCloudinaryUrl(url)).toBe(false);
            });
        });
    });

    describe('isBase64Image', () => {
        it('should return true for valid Base64 image strings', () => {
            const validBase64 = [
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
            ];

            validBase64.forEach(str => {
                expect(CloudinaryService.isBase64Image(str)).toBe(true);
            });
        });

        it('should return false for non-Base64 image strings', () => {
            const invalidBase64 = [
                'https://res.cloudinary.com/test/image/upload/v123/test.jpg',
                'http://example.com/image.jpg',
                'regular string',
                '',
                null,
                undefined,
                123
            ];

            invalidBase64.forEach(str => {
                expect(CloudinaryService.isBase64Image(str)).toBe(false);
            });
        });
    });

    describe('extractPublicId', () => {
        it('should extract public ID from standard Cloudinary URLs', () => {
            const testCases = [
                {
                    url: 'https://res.cloudinary.com/wwv1h4ll/image/upload/v123456/fakhem/product1.jpg',
                    expected: 'fakhem/product1'
                },
                {
                    url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
                    expected: 'sample'
                },
                {
                    url: 'https://res.cloudinary.com/test/image/upload/v1/folder/subfolder/image.png',
                    expected: 'folder/subfolder/image'
                }
            ];

            testCases.forEach(({ url, expected }) => {
                expect(CloudinaryService.extractPublicId(url)).toBe(expected);
            });
        });

        it('should extract public ID from Cloudinary URLs with transformations', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/c_fill,w_300,h_300/v123456/folder/test.jpg';
            expect(CloudinaryService.extractPublicId(url)).toBe('folder/test');
        });

        it('should return null for invalid inputs', () => {
            const invalidInputs = [
                'http://example.com/image.jpg',
                'data:image/png;base64,iVBORw0KGgo...',
                'not a url',
                '',
                null,
                undefined,
                123
            ];

            invalidInputs.forEach(input => {
                expect(CloudinaryService.extractPublicId(input)).toBeNull();
            });
        });

        it('should return null for Cloudinary URLs without proper structure', () => {
            const malformedUrls = [
                'https://res.cloudinary.com/demo/image/',
                'https://res.cloudinary.com/demo/'
            ];

            malformedUrls.forEach(url => {
                expect(CloudinaryService.extractPublicId(url)).toBeNull();
            });
        });
    });

    describe('Error Handling', () => {
        it('should throw error for deleteImage with null publicId', async () => {
            await expect(CloudinaryService.deleteImage(null))
                .rejects
                .toThrow('Public ID is required for deletion');
        });

        it('should throw error for deleteImage with empty publicId', async () => {
            await expect(CloudinaryService.deleteImage(''))
                .rejects
                .toThrow('Public ID is required for deletion');
        });

        it('should return empty array for deleteImages with empty array', async () => {
            const result = await CloudinaryService.deleteImages([]);
            expect(result).toEqual([]);
        });

        it('should return empty array for deleteImages with null', async () => {
            const result = await CloudinaryService.deleteImages(null);
            expect(result).toEqual([]);
        });
    });
});
