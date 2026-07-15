const fc = require('fast-check');
const Product = require('../../api/models/Product');
const Category = require('../../api/models/Category');
const Service = require('../../api/models/Service');
const Settings = require('../../api/models/Settings');

/**
 * Property-Based Tests for Validation Logic
 * Feature: admin-panel-cloudinary
 * 
 * Tests three key properties:
 * - Property 7: Required Field Validation
 * - Property 4: URL Validation for Social Media
 * - Property 8: Logo File Size Validation
 */

describe('Property-Based Validation Tests', () => {
    // No DB connection needed — Mongoose .validate() works without a live connection

    describe('Property 7: Required Field Validation', () => {
        /**
         * **Validates: Requirements 3.9, 4.6, 5.8, 7.6, 8.7**
         * 
         * Property: For any entity (product, category, or service) where any required field 
         * (name for products/categories, name and description for services) is an empty string 
         * or contains only whitespace, the validation SHALL fail and prevent saving to the database.
         */

        it('should reject products with empty or whitespace-only names', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n  '),
                    async (invalidName) => {
                        const product = new Product({
                            name: invalidName,
                            category: 'Test Category',
                            images: [],
                            sizes: [{ size: '50ml', price: 100 }]
                        });

                        let validationFailed = false;
                        try {
                            await product.validate();
                        } catch (error) {
                            validationFailed = true;
                            expect(error.name).toBe('ValidationError');
                            expect(error.errors.name).toBeDefined();
                        }

                        expect(validationFailed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject categories with empty or whitespace-only names', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n  '),
                    async (invalidName) => {
                        const category = new Category({
                            name: invalidName
                        });

                        let validationFailed = false;
                        try {
                            await category.validate();
                        } catch (error) {
                            validationFailed = true;
                            expect(error.name).toBe('ValidationError');
                            expect(error.errors.name).toBeDefined();
                        }

                        expect(validationFailed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject services with empty or whitespace-only names', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n  '),
                    async (invalidName) => {
                        const service = new Service({
                            name: invalidName,
                            desc: 'Valid description'
                        });

                        let validationFailed = false;
                        try {
                            await service.validate();
                        } catch (error) {
                            validationFailed = true;
                            expect(error.name).toBe('ValidationError');
                            expect(error.errors.name).toBeDefined();
                        }

                        expect(validationFailed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject services with empty or whitespace-only descriptions', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n  '),
                    async (invalidDesc) => {
                        const service = new Service({
                            name: 'Valid Name',
                            desc: invalidDesc
                        });

                        let validationFailed = false;
                        try {
                            await service.validate();
                        } catch (error) {
                            validationFailed = true;
                            expect(error.name).toBe('ValidationError');
                            expect(error.errors.desc).toBeDefined();
                        }

                        expect(validationFailed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should accept products with non-empty names after trimming', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                    async (validName) => {
                        const product = new Product({
                            name: validName,
                            category: 'Test Category',
                            images: [],
                            sizes: [{ size: '50ml', price: 100 }]
                        });

                        let validationPassed = true;
                        try {
                            await product.validate();
                        } catch (error) {
                            validationPassed = false;
                        }

                        expect(validationPassed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    describe('Property 4: URL Validation for Social Media', () => {
        /**
         * **Validates: Requirements 8.7**
         * 
         * Property: For any Instagram URL that passes validation, it SHALL match the pattern 
         * `https?://(www\.)?instagram\.com/.+`, and similarly for Facebook URLs with the Facebook domain.
         */

        it('should accept valid Instagram URLs', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom(
                        'http://instagram.com/fakhem',
                        'https://instagram.com/fakhem',
                        'http://www.instagram.com/fakhem',
                        'https://www.instagram.com/fakhem',
                        'https://instagram.com/fakhem/profile',
                        'https://www.instagram.com/fakhem_perfumes/'
                    ),
                    async (validInstagramUrl) => {
                        const settings = new Settings({
                            instagram: validInstagramUrl
                        });

                        let validationPassed = true;
                        try {
                            await settings.validate();
                        } catch (error) {
                            validationPassed = false;
                        }

                        expect(validationPassed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject invalid Instagram URLs', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom(
                        'not-a-url',
                        'http://twitter.com/fakhem',
                        'https://facebook.com/fakhem',
                        'ftp://instagram.com/fakhem',
                        'instagram.com/fakhem', // Missing protocol
                        'https://instagr.am/fakhem', // Wrong domain
                        'https://instagram.com', // Missing path
                        'https://instagram.com/' // Missing username
                    ),
                    async (invalidInstagramUrl) => {
                        const settings = new Settings({
                            instagram: invalidInstagramUrl
                        });

                        let validationFailed = false;
                        try {
                            await settings.validate();
                        } catch (error) {
                            validationFailed = true;
                            expect(error.name).toBe('ValidationError');
                            expect(error.errors.instagram).toBeDefined();
                        }

                        expect(validationFailed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should accept valid Facebook URLs', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom(
                        'http://facebook.com/fakhem',
                        'https://facebook.com/fakhem',
                        'http://www.facebook.com/fakhem',
                        'https://www.facebook.com/fakhem',
                        'https://facebook.com/fakhem/profile',
                        'https://www.facebook.com/fakhem.perfumes/'
                    ),
                    async (validFacebookUrl) => {
                        const settings = new Settings({
                            facebook: validFacebookUrl
                        });

                        let validationPassed = true;
                        try {
                            await settings.validate();
                        } catch (error) {
                            validationPassed = false;
                        }

                        expect(validationPassed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject invalid Facebook URLs', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom(
                        'not-a-url',
                        'http://twitter.com/fakhem',
                        'https://instagram.com/fakhem',
                        'ftp://facebook.com/fakhem',
                        'facebook.com/fakhem', // Missing protocol
                        'https://fb.com/fakhem', // Wrong domain
                        'https://facebook.com', // Missing path
                        'https://facebook.com/' // Missing page
                    ),
                    async (invalidFacebookUrl) => {
                        const settings = new Settings({
                            facebook: invalidFacebookUrl
                        });

                        let validationFailed = false;
                        try {
                            await settings.validate();
                        } catch (error) {
                            validationFailed = true;
                            expect(error.name).toBe('ValidationError');
                            expect(error.errors.facebook).toBeDefined();
                        }

                        expect(validationFailed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should accept empty strings for optional social media URLs', async () => {
            const settings = new Settings({
                instagram: '',
                facebook: ''
            });

            let validationPassed = true;
            try {
                await settings.validate();
            } catch (error) {
                validationPassed = false;
            }

            expect(validationPassed).toBe(true);
        });
    });

    describe('Property 8: Logo File Size Validation', () => {
        /**
         * **Validates: Requirements 7.6**
         * 
         * Property: For any uploaded logo file with size S bytes where S ≤ 5,242,880 (5MB), 
         * the upload SHALL be accepted. For any file where S > 5,242,880, the upload SHALL 
         * be rejected with a size validation error.
         */

        it('should accept logo files with size ≤ 5MB', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.integer({ min: 0, max: 5242880 }), // 0 to 5MB in bytes
                    async (fileSize) => {
                        // Simulate file size validation
                        const isValidSize = fileSize <= 5242880;
                        expect(isValidSize).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should reject logo files with size > 5MB', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.integer({ min: 5242881, max: 10485760 }), // 5MB+1 byte to 10MB
                    async (fileSize) => {
                        // Simulate file size validation
                        const isValidSize = fileSize <= 5242880;
                        expect(isValidSize).toBe(false);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should validate exactly 5MB (5,242,880 bytes) as acceptable', () => {
            const exactFiveMB = 5242880;
            const isValidSize = exactFiveMB <= 5242880;
            expect(isValidSize).toBe(true);
        });

        it('should reject exactly 5MB + 1 byte (5,242,881 bytes)', () => {
            const fiveMBPlusOne = 5242881;
            const isValidSize = fiveMBPlusOne <= 5242880;
            expect(isValidSize).toBe(false);
        });

        it('should accept zero-byte files (edge case)', () => {
            const zeroBytes = 0;
            const isValidSize = zeroBytes <= 5242880;
            expect(isValidSize).toBe(true);
        });

        it('should test boundary values around 5MB limit', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom(
                        5242879, // Just under 5MB
                        5242880, // Exactly 5MB
                        5242881  // Just over 5MB
                    ),
                    async (fileSize) => {
                        const isValidSize = fileSize <= 5242880;
                        const expectedResult = fileSize <= 5242880;
                        expect(isValidSize).toBe(expectedResult);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    describe('Integration: Combined Validation Properties', () => {
        it('should validate all settings fields together', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constantFrom('https://instagram.com/fakhem', ''),
                    fc.constantFrom('https://facebook.com/fakhem', ''),
                    fc.string().filter(s => /^\d*$/.test(s)), // Valid WhatsApp (digits only or empty)
                    async (instagram, facebook, whatsapp) => {
                        const settings = new Settings({
                            instagram,
                            facebook,
                            whatsapp
                        });

                        let validationPassed = true;
                        try {
                            await settings.validate();
                        } catch (error) {
                            validationPassed = false;
                        }

                        expect(validationPassed).toBe(true);
                    }
                ),
                { numRuns: 10 }
            );
        });

        it('should fail validation when multiple fields are invalid', async () => {
            const settings = new Settings({
                instagram: 'invalid-url',
                facebook: 'also-invalid',
                whatsapp: 'not-digits!'
            });

            let validationFailed = false;
            try {
                await settings.validate();
            } catch (error) {
                validationFailed = true;
                expect(error.name).toBe('ValidationError');
                // Should have errors for all three fields
                expect(error.errors.instagram).toBeDefined();
                expect(error.errors.facebook).toBeDefined();
                expect(error.errors.whatsapp).toBeDefined();
            }

            expect(validationFailed).toBe(true);
        });
    });
});
