const fc = require('fast-check');
const cloudinaryService = require('../../api/services/cloudinary.service');

describe('URL Parsing Property-Based Tests', () => {
    describe('Property 1: Cloudinary URL Format Validation', () => {
        /**
         * **Validates: Requirements 1.6, 9.4**
         *
         * For any string that is identified as a Cloudinary URL, it SHALL match
         * the pattern `https://res.cloudinary.com/{cloud_name}/` and return `true`
         * when passed to `isCloudinaryUrl()`.
         */
        it('should correctly identify valid Cloudinary URLs with various cloud names and paths', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-z0-9_-]{1,30}$/),
                    fc.stringMatching(/^[a-z0-9_/-]{1,50}$/),
                    (cloudName, path) => {
                        const url = `https://res.cloudinary.com/${cloudName}/${path}`;
                        return cloudinaryService.isCloudinaryUrl(url) === true;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject non-Cloudinary URLs', () => {
            fc.assert(
                fc.property(
                    fc.webUrl(),
                    (url) => {
                        fc.pre(!url.startsWith('https://res.cloudinary.com/'));
                        return cloudinaryService.isCloudinaryUrl(url) === false;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should handle edge cases for Cloudinary URL validation', () => {
            fc.assert(
                fc.property(
                    fc.oneof(
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.constant(''),
                        fc.integer(),
                        fc.constant({}),
                        fc.constant([])
                    ),
                    (invalidInput) => {
                        return cloudinaryService.isCloudinaryUrl(invalidInput) === false;
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    describe('Property 2: Base64 Image Detection', () => {
        /**
         * **Validates: Requirements 12.3**
         *
         * For any string that is identified as a Base64 image, it SHALL start
         * with the pattern `data:image/` and return `true` when passed to
         * `isBase64Image()`.
         */
        it('should correctly identify Base64 encoded images with various formats', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom('jpeg', 'png', 'gif', 'webp'),
                    fc.base64String({ minLength: 10, maxLength: 50 }),
                    (format, base64Data) => {
                        const dataUri = `data:image/${format};base64,${base64Data}`;
                        return cloudinaryService.isBase64Image(dataUri) === true;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject non-Base64 image strings', () => {
            fc.assert(
                fc.property(
                    fc.string(),
                    (str) => {
                        fc.pre(!str.startsWith('data:image/'));
                        return cloudinaryService.isBase64Image(str) === false;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should handle edge cases for Base64 image detection', () => {
            fc.assert(
                fc.property(
                    fc.oneof(
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.constant(''),
                        fc.integer(),
                        fc.constant({}),
                        fc.constant([])
                    ),
                    (invalidInput) => {
                        return cloudinaryService.isBase64Image(invalidInput) === false;
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    describe('Property 3: Public ID Extraction Consistency', () => {
        /**
         * **Validates: Requirements 1.3, 9.4**
         *
         * For any valid Cloudinary URL, extracting the public ID SHALL return
         * the same public ID used to construct it.
         */
        it('should consistently extract public IDs from Cloudinary URLs', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-z0-9_-]{1,20}$/),
                    fc.stringMatching(/^[a-z0-9_-]{1,20}$/),
                    fc.constantFrom('jpg', 'png', 'webp', 'gif'),
                    fc.integer({ min: 1000000000, max: 9999999999 }),
                    (cloudName, publicId, extension, version) => {
                        const url = `https://res.cloudinary.com/${cloudName}/image/upload/v${version}/${publicId}.${extension}`;
                        const extracted = cloudinaryService.extractPublicId(url);
                        return extracted === publicId;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should extract public IDs from Cloudinary URLs with transformations', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-z0-9_-]{1,20}$/),
                    fc.stringMatching(/^[a-z0-9_-]{1,20}$/),
                    fc.constantFrom('jpg', 'png', 'webp', 'gif'),
                    fc.integer({ min: 1000000000, max: 9999999999 }),
                    fc.stringMatching(/^[a-z0-9_,]{5,20}$/),
                    (cloudName, publicId, extension, version, transformations) => {
                        const url = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/v${version}/${publicId}.${extension}`;
                        const extracted = cloudinaryService.extractPublicId(url);
                        return extracted === publicId;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should extract public IDs with folder paths', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-z0-9_-]{1,15}$/),
                    fc.stringMatching(/^[a-z0-9_-]{1,15}$/),
                    fc.stringMatching(/^[a-z0-9_-]{1,15}$/),
                    fc.constantFrom('jpg', 'png', 'webp', 'gif'),
                    fc.integer({ min: 1000000000, max: 9999999999 }),
                    (cloudName, folder, fileName, extension, version) => {
                        const publicId = `${folder}/${fileName}`;
                        const url = `https://res.cloudinary.com/${cloudName}/image/upload/v${version}/${publicId}.${extension}`;
                        const extracted = cloudinaryService.extractPublicId(url);
                        return extracted === publicId;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should return null for non-Cloudinary URLs', () => {
            fc.assert(
                fc.property(
                    fc.webUrl(),
                    (url) => {
                        fc.pre(!url.startsWith('https://res.cloudinary.com/'));
                        return cloudinaryService.extractPublicId(url) === null;
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should handle edge cases for public ID extraction', () => {
            fc.assert(
                fc.property(
                    fc.oneof(
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.constant(''),
                        fc.integer(),
                        fc.constant({}),
                        fc.constant([])
                    ),
                    (invalidInput) => {
                        return cloudinaryService.extractPublicId(invalidInput) === null;
                    }
                ),
                { numRuns: 10 }
            );
        });
    });
});
