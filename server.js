const app = require('./api/index.js');
const express = require('express');
const path = require('path');

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Keep for backward compatibility with old local files

// Explicit route for admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Fallback to index.html for unknown routes (SPA behavior)
app.get(/^.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
