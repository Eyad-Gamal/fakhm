const app = require('./api/index.js');
const express = require('express');
const path = require('path');
const fs = require('fs');

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
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
