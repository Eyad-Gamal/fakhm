const app = require('./api/index.js');
const express = require('express');
const path = require('path');
const fs = require('fs');

/**
 * Validate that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
function validateEnvironment() {
    const required = [
        'MONGO_URI',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }

    console.log('✓ Environment validation passed');
}

// Validate environment variables on startup
try {
    validateEnvironment();
} catch (error) {
    console.error('Configuration Error:', error.message);
    process.exit(1);
}

// Resolve absolute paths once at startup to avoid issues with Arabic directory names
const DIST_DIR = path.resolve(__dirname, 'dist');
const INDEX_HTML = path.resolve(__dirname, 'dist', 'index.html');

// Serve static files from 'dist' directory
app.use(express.static(DIST_DIR));
app.use('/uploads', express.static(path.resolve(__dirname, 'public', 'uploads')));

// Fallback to index.html for unknown routes (SPA behavior)
app.get(/^.*$/, (req, res) => {
    try {
        const html = fs.readFileSync(INDEX_HTML, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(404).send('Not found');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
