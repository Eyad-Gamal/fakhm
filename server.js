const app = require('./api/index.js');
const express = require('express');
const path = require('path');
const fs = require('fs');

<<<<<<< HEAD
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
=======
// Determine if we should serve 'dist' (React build) or 'public' (static assets)
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Serve Vite build output if it exists
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Serve public directory for raw assets (like images)
app.use(express.static(publicPath));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Keep for backward compatibility with old local files

// Fallback to React's index.html for unknown routes (SPA behavior)
app.get(/^.*$/, (req, res) => {
    if (fs.existsSync(distPath)) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        res.sendFile(path.join(publicPath, 'index.html'));
>>>>>>> d1b128a0f5b568b4c112ca812cd6cb3ec886b324
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
