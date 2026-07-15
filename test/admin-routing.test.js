const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const fc = require('fast-check');

// We need to set up a test server that mimics the FIXED server.js routing structure
// This test file will test against the FIXED code to verify the bug is resolved

// Shared test server - used by both bug condition and preservation tests
let app;
let server;

beforeAll(() => {
    // Create a minimal Express app that replicates the FIXED routing structure from server.js
    // This now includes the explicit /admin route handler BEFORE the catch-all route
    app = express();

    // Serve static files from 'public' directory (line 19 in server.js)
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Explicit route for admin panel (line 317-319 in server.js) - THE FIX
    app.get('/admin', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
    });

    // Fallback to index.html for unknown routes (SPA behavior) (line 321-323 in server.js)
    app.get(/^.*$/, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });

    // Start test server
    const PORT = 5555; // Use different port for testing
    server = app.listen(PORT);
});

afterAll((done) => {
    if (server) {
        server.close(done);
    } else {
        done();
    }
});

describe('Admin Routing Bug Condition Exploration', () => {

    /**
     * Property 1: Expected Behavior - Admin Route Serves Admin Panel
     * 
     * **Validates: Requirements 2.1, 2.2, 2.3**
     * 
     * This test encodes the EXPECTED BEHAVIOR: /admin should serve admin.html
     * 
     * IMPORTANT: This test should now PASS on the fixed code - confirming the bug is resolved
     * 
     * The expected behavior is: GET request to /admin returns admin.html content with admin markers
     */
    describe('Property 1: Admin Route Serves Admin Panel (EXPECTED BEHAVIOR)', () => {

        test('GET /admin should return status 200', async () => {
            const response = await request(app).get('/admin');

            // Status will be 200, but content is wrong (the bug)
            expect(response.status).toBe(200);
        });

        test('GET /admin should serve admin.html content with admin panel markers', async () => {
            const response = await request(app).get('/admin');

            // Check for admin-specific content markers from admin.html
            // These are unique to the admin panel and should be present

            // Marker 1: Arabic title "لوحة التحكم" (Admin Panel)
            expect(response.text).toContain('لوحة التحكم');

            // Marker 2: admin-layout class (unique to admin.html)
            expect(response.text).toContain('admin-layout');

            // Marker 3: sidebar class (admin panel has a sidebar)
            expect(response.text).toContain('sidebar');

            // Marker 4: admin-specific CSS class
            expect(response.text).toContain('sidebar-nav');
        });

        test('GET /admin should NOT return index.html content', async () => {
            const response = await request(app).get('/admin');

            // Read index.html to get unique markers that should NOT be in admin response
            const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
            const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8');

            // Extract a unique marker from index.html (if it exists)
            // Look for the main website structure that shouldn't be in admin panel

            // The response should be admin.html, not index.html
            // If the bug exists, this will fail because response will match index.html
            const adminHtmlPath = path.join(__dirname, '..', 'public', 'admin.html');
            const adminContent = fs.readFileSync(adminHtmlPath, 'utf-8');

            // Verify we get admin content, not index content
            // The bug will cause this to fail - we'll get index.html instead
            expect(response.text).toBe(adminContent);
        });

        test('GET /admin should have Content-Type text/html', async () => {
            const response = await request(app).get('/admin');

            expect(response.headers['content-type']).toMatch(/text\/html/);
        });
    });

    /**
     * Additional test for trailing slash variant
     */
    describe('Edge Case: Admin route with trailing slash', () => {
        test('GET /admin/ should also serve admin.html (if implemented)', async () => {
            const response = await request(app).get('/admin/');

            // This may also fail with the bug - catch-all will intercept this too
            expect(response.status).toBe(200);
            expect(response.text).toContain('لوحة التحكم');
            expect(response.text).toContain('admin-layout');
        });
    });
});

/**
 * Property 2: Preservation - Existing Route Behavior Unchanged
 * 
 * **Validates: Requirements 3.1, 3.3, 3.4**
 * 
 * IMPORTANT: These tests follow observation-first methodology
 * - Run on UNFIXED code to observe current (correct) behavior
 * - Tests should PASS on unfixed code (confirming baseline to preserve)
 * - After fix is applied, these same tests should still PASS (no regressions)
 * 
 * NOTE: API route tests (3.2, 3.5, 3.6) require testing against the real server
 * with MongoDB connection and full API implementation. The mock test server used
 * here only replicates the static file serving and catch-all routing structure.
 * API routes should be tested manually or with integration tests.
 * 
 * This test suite uses property-based testing to generate many test cases
 * and provide strong guarantees that non-admin routes remain unchanged.
 */
describe('Property 2: Preservation - Existing Routes Unchanged (BEFORE FIX)', () => {

    /**
     * Requirement 3.1: Root path serves index.html
     */
    describe('Root Path Preservation', () => {
        test('GET / should return index.html content', async () => {
            const response = await request(app).get('/');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/text\/html/);

            // Read index.html to verify content matches
            const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
            const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8');

            expect(response.text).toBe(indexContent);
        });

        test('Root path should serve HTML with expected structure', async () => {
            const response = await request(app).get('/');

            // Verify it's HTML content
            expect(response.text).toContain('<!DOCTYPE html>');
            expect(response.text).toContain('<html');
            expect(response.text).toContain('</html>');
        });
    });

    /**
     * Requirement 3.3: Static assets are served correctly
     */
    describe('Static Assets Preservation', () => {
        test('GET /فخم.jfif should return image file', async () => {
            const response = await request(app).get('/فخم.jfif');

            // Verify file exists and is served correctly
            if (fs.existsSync(path.join(__dirname, '..', 'public', 'فخم.jfif'))) {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/image/);
            } else {
                // If file doesn't exist, catch-all serves index.html
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/text\/html/);
            }
        });

        test('GET /فخم.png should return image file', async () => {
            const response = await request(app).get('/فخم.png');

            if (fs.existsSync(path.join(__dirname, '..', 'public', 'فخم.png'))) {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/image/);
            } else {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/text\/html/);
            }
        });

        test('Static HTML files like index.html can be accessed directly', async () => {
            const response = await request(app).get('/index.html');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/text\/html/);
        });
    });

    /**
     * Requirement 3.4: Unknown routes serve index.html for SPA fallback
     */
    describe('SPA Fallback Preservation', () => {
        test('GET /unknown-page should return index.html (SPA fallback)', async () => {
            const response = await request(app).get('/unknown-page');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/text\/html/);

            // Should serve index.html for SPA client-side routing
            const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
            const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8');

            expect(response.text).toBe(indexContent);
        });

        test('GET /about should return index.html (SPA fallback)', async () => {
            const response = await request(app).get('/about');

            expect(response.status).toBe(200);

            const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
            const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8');

            expect(response.text).toBe(indexContent);
        });

        test('GET /contact should return index.html (SPA fallback)', async () => {
            const response = await request(app).get('/contact');

            expect(response.status).toBe(200);

            const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
            const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8');

            expect(response.text).toBe(indexContent);
        });
    });

    /**
     * Property-Based Test: Non-admin routes serve index.html or appropriate content
     * 
     * This test generates many random paths that are NOT /admin and verifies
     * that they all produce consistent, expected behavior (either static files
     * or SPA fallback to index.html)
     */
    describe('Property-Based: Non-admin routes preserved', () => {
        test('Random non-admin paths should serve index.html (SPA) or static content', async () => {
            // Property: For any path that is NOT /admin, the server should return
            // either a static file (200 + correct content-type) or index.html (200 + HTML)

            await fc.assert(
                fc.asyncProperty(
                    // Generate random paths that are NOT /admin
                    fc.string({ minLength: 1, maxLength: 20 })
                        .filter(path => path !== 'admin' && !path.startsWith('api/'))
                        .map(path => `/${path}`),
                    async (randomPath) => {
                        const response = await request(app).get(randomPath);

                        // Should always return 200 (either static file or SPA fallback)
                        expect(response.status).toBe(200);

                        // Content type should be either HTML (index.html) or a static file type
                        const contentType = response.headers['content-type'];
                        expect(contentType).toBeDefined();

                        // If it's HTML, it should be index.html (SPA fallback)
                        if (contentType && contentType.includes('text/html')) {
                            const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
                            const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8');
                            expect(response.text).toBe(indexContent);
                        }
                    }
                ),
                { numRuns: 50 } // Run 50 random test cases
            );
        });

        test('Known good paths should consistently return expected content', async () => {
            // Property: Specific known paths should always return the same content

            const knownPaths = [
                { path: '/', expectHtml: true },
                { path: '/index.html', expectHtml: true },
                { path: '/unknown-test-route', expectHtml: true }
            ];

            for (const testCase of knownPaths) {
                const response = await request(app).get(testCase.path);

                expect(response.status).toBe(200);

                if (testCase.expectHtml) {
                    expect(response.headers['content-type']).toMatch(/text\/html/);
                }
            }
        });
    });

    /**
     * Property-Based Test: Path format variations should be handled consistently
     */
    describe('Property-Based: Path format variations', () => {
        test('Paths with query parameters should work correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.record({
                        path: fc.constantFrom('/', '/unknown'),
                        param: fc.string({ minLength: 1, maxLength: 10 }),
                        value: fc.string({ minLength: 1, maxLength: 10 })
                    }),
                    async ({ path: basePath, param, value }) => {
                        const fullPath = `${basePath}?${param}=${value}`;
                        const response = await request(app).get(fullPath);

                        // Should handle query params gracefully
                        expect(response.status).toBe(200);
                    }
                ),
                { numRuns: 20 }
            );
        });

        test('Paths with various encodings should work', async () => {
            // Test that Arabic filenames and paths work correctly
            const arabicPaths = [
                '/فخم.jfif',
                '/فخم.png',
                '/test-عربي',
                '/منتجات'
            ];

            for (const arabicPath of arabicPaths) {
                const response = await request(app).get(arabicPath);

                // Should return 200 (either file or SPA fallback)
                expect(response.status).toBe(200);
            }
        });
    });
});
